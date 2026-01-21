import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function useClientStatus() {
  const searchParams = useSearchParams();
  const [isReturning, setIsReturning] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [isCheckingIp, setIsCheckingIp] = useState(true);

  useEffect(() => {
    // Check URL parameters first
    const isReturningParam = searchParams.get('client') === 'returning';
    const nameParam = searchParams.get('name');

    // Check URL first, then fall back to session storage
    if (isReturningParam) {
      setIsReturning(true);
      if (nameParam) {
        setClientName(nameParam);
        sessionStorage.setItem('stylish_client_name', nameParam);
      }
      sessionStorage.setItem('stylish_returning_status', 'true');
      setIsCheckingIp(false);
      return;
    }

    // Check sessionStorage for existing recognition
    const savedStatus = sessionStorage.getItem('stylish_returning_status');
    const savedName = sessionStorage.getItem('stylish_client_name');
    if (savedStatus === 'true') {
      setIsReturning(true);
      setClientName(savedName);
      setIsCheckingIp(false);
      return;
    }

    // If no URL param or sessionStorage, check IP against database
    const checkIpRecognition = async () => {
      try {
        // Get user's IP address using multiple fallback services
        let userIp: string | null = null;
        
        try {
          // Create timeout controller for 3 second timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const ipResponse = await fetch('https://api.ipify.org?format=json', {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          const ipData = await ipResponse.json();
          userIp = ipData.ip;
        } catch (ipError) {
          // Fallback to alternative IP service
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const fallbackResponse = await fetch('https://api64.ipify.org?format=json', {
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const fallbackData = await fallbackResponse.json();
            userIp = fallbackData.ip;
          } catch (fallbackError) {
            // Silently fail - IP check is optional
            userIp = null;
          }
        }

        if (userIp && userIp !== 'Unknown') {
          // Check if IP matches any provisional bookings in database
          try {
            const recognitionResponse = await fetch('/api/client/check-ip-recognition', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ip: userIp }),
            });

            // Silently handle errors - IP recognition is optional
            if (!recognitionResponse.ok) {
              // Log in development only, but don't throw
              if (process.env.NODE_ENV === 'development') {
                console.warn('IP recognition API returned:', recognitionResponse.status);
              }
              return; // Exit early, don't process response
            }

            const recognitionData = await recognitionResponse.json();

            // If IP match found, automatically trigger isReturning state
            if (recognitionData.recognized === true) {
              setIsReturning(true);
              
              // Store client name if available
              if (recognitionData.clientName) {
                setClientName(recognitionData.clientName);
                sessionStorage.setItem('stylish_client_name', recognitionData.clientName);
              }
              
              // Mark as recognized in sessionStorage for persistence
              sessionStorage.setItem('stylish_returning_status', 'true');
              
              // Store booking ID for later use (e.g., in secure-booking page)
              if (recognitionData.bookingId) {
                sessionStorage.setItem('stylish_booking_id', recognitionData.bookingId);
              }
              
              // Also store other booking details if needed
              if (recognitionData.venueName) {
                sessionStorage.setItem('stylish_venue_name', recognitionData.venueName);
              }
            }
          } catch (fetchError) {
            // Silently handle fetch errors - IP recognition is optional
            if (process.env.NODE_ENV === 'development') {
              console.warn('IP recognition fetch error:', fetchError);
            }
          }
        }
      } catch (error) {
        // Silently fail - don't show error to user
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Error checking IP recognition:', error);
        }
      } finally {
        setIsCheckingIp(false);
      }
    };

    // Only check IP if we haven't found recognition via URL or sessionStorage
    checkIpRecognition();
  }, [searchParams]);

  return { isReturning, clientName, isCheckingIp };
}
