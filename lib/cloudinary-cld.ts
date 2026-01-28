import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
  cloud: { cloudName: "drtwveoqo" },
  url: { secure: true },
});
