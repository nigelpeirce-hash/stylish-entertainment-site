/**
 * Single cohesive footer component for all client-facing emails.
 * High-end, elegant, minimalist — invitation-style, not corporate.
 *
 * Hierarchy:
 * 1. Sign-off: Kind Regards, Ali & Nige (serif for names)
 * 2. Contact Row: Call | Email | Website (single line, subtle separator)
 * 3. Socials: simple text links, monochrome
 * 4. Tagline: uppercase, letter-spacing
 * 5. Company: uppercase, letter-spacing
 */

const PHONE = "+44 7970 793177";
const PHONE_DISPLAY = "07970 793177";
const EMAIL = "info@stylishentertainment.co.uk";
const WEBSITE = "https://stylishentertainment.co.uk";
const WEBSITE_DISPLAY = "stylishentertainment.co.uk";
const FACEBOOK_URL = "https://www.facebook.com/StylishEntertainment";
const INSTAGRAM_URL = "https://www.instagram.com/stylishentertainment/";
const YOUTUBE_URL = "https://www.youtube.com/@stylishentertainment937/playlists";

const COMPANY_LINE = "Stylish Entertainment Ltd | South West · London · UK-wide";

/** Plain-text footer for .text email bodies (same hierarchy). */
export const CLIENT_SIGNOFF_TEXT = `Kind Regards,
Ali & Nige

${PHONE_DISPLAY}  |  ${EMAIL}  |  ${WEBSITE_DISPLAY}
Facebook · Instagram · YouTube

Every gathering deserves to be extraordinary

${COMPANY_LINE}`;

/**
 * Light footer: user-provided layout — serif for sign-off, single-line contact, socials, tagline, company.
 */
export const SIGNATURE_BLOCK_HTML = `
<div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eeeeee; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #444444; line-height: 1.6;">
  <p style="font-family: 'Georgia', serif; font-size: 18px; font-style: italic; margin-bottom: 5px; color: #222222;">Kind Regards,</p>
  <p style="font-family: 'Georgia', serif; font-size: 20px; margin-top: 0; margin-bottom: 20px; color: #222222;">Ali & Nige</p>
  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 10px;">
    <a href="tel:+447970793177" style="color: #888888; text-decoration: none;">07970 793177</a> &nbsp; | &nbsp;
    <a href="mailto:${EMAIL}" style="color: #888888; text-decoration: none;">${EMAIL}</a> &nbsp; | &nbsp;
    <a href="${WEBSITE}" style="color: #888888; text-decoration: none;">${WEBSITE_DISPLAY}</a>
  </p>
  <p style="font-size: 11px; margin-bottom: 25px;">
    <a href="${FACEBOOK_URL}" style="color: #444444; text-decoration: none;">FACEBOOK</a> &nbsp;&nbsp;
    <a href="${INSTAGRAM_URL}" style="color: #444444; text-decoration: none;">INSTAGRAM</a> &nbsp;&nbsp;
    <a href="${YOUTUBE_URL}" style="color: #444444; text-decoration: none;">YOUTUBE</a>
  </p>
  <p style="font-size: 7px; font-weight: 300; text-transform: uppercase; letter-spacing: 4px; color: #aaaaaa; margin-bottom: 5px;">E V E R Y &nbsp; G A T H E R I N G &nbsp; D E S E R V E S &nbsp; T O &nbsp; B E &nbsp; E X T R A O R D I N A R Y</p>
  <p style="font-size: 10px; color: #cccccc; margin-top: 0;">${COMPANY_LINE}</p>
</div>
`.trim();

/**
 * Dark footer: same layout as light; light grey/white text for dark email backgrounds.
 */
export const SIGNATURE_BLOCK_HTML_DARK = `
<div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #444444; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #cccccc; line-height: 1.6;">
  <p style="font-family: 'Georgia', serif; font-size: 18px; font-style: italic; margin-bottom: 5px; color: #eeeeee !important;">Kind Regards,</p>
  <p style="font-family: 'Georgia', serif; font-size: 20px; margin-top: 0; margin-bottom: 20px; color: #ffffff !important;">Ali & Nige</p>
  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #aaaaaa !important; margin-bottom: 10px;">
    <a href="tel:+447970793177" style="color: #aaaaaa !important; text-decoration: none;">07970 793177</a> &nbsp; | &nbsp;
    <a href="mailto:${EMAIL}" style="color: #aaaaaa !important; text-decoration: none;">${EMAIL}</a> &nbsp; | &nbsp;
    <a href="${WEBSITE}" style="color: #aaaaaa !important; text-decoration: none;">${WEBSITE_DISPLAY}</a>
  </p>
  <p style="font-size: 11px; margin-bottom: 25px;">
    <a href="${FACEBOOK_URL}" style="color: #cccccc !important; text-decoration: none;">FACEBOOK</a> &nbsp;&nbsp;
    <a href="${INSTAGRAM_URL}" style="color: #cccccc !important; text-decoration: none;">INSTAGRAM</a> &nbsp;&nbsp;
    <a href="${YOUTUBE_URL}" style="color: #cccccc !important; text-decoration: none;">YOUTUBE</a>
  </p>
  <p style="font-size: 7px; font-weight: 300; text-transform: uppercase; letter-spacing: 4px; color: #888888 !important; margin-bottom: 5px;">E V E R Y &nbsp; G A T H E R I N G &nbsp; D E S E R V E S &nbsp; T O &nbsp; B E &nbsp; E X T R A O R D I N A R Y</p>
  <p style="font-size: 10px; color: #666666 !important; margin-top: 0;">${COMPANY_LINE}</p>
</div>
`.trim();
