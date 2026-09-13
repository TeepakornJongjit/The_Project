import "server-only";
export function siteUrl():string{
 const value=process.env.NEXT_PUBLIC_SITE_URL??(process.env.NODE_ENV==="development"?"http://localhost:3000":"");
 if(!value) throw Error("NEXT_PUBLIC_SITE_URL is required");
 const url=new URL(value);
 if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw Error("Invalid site URL");
 return url.origin;
}
