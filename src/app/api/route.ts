import { type Entity, type countries } from "../../constants";

type CountryType = keyof typeof countries;

export async function GET(request: Request) {
  const formData = new URL(request.url).searchParams;

  let entity = (formData.get("entity") as Entity) || "tvSeason";
  const country = (formData.get("country")! as CountryType) || "us";
  const query = formData.get("query")!;
  let shortFilm = false;

  if (entity === "shortFilm") {
    shortFilm = true;
    entity = "movie";
  }

  let url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}`;
  if (shortFilm) {
    url += "&attribute=shortFilmTerm";
    entity = "shortFilm";
  }

  if (entity === "id" || entity === "idAlbum")
    url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(query)}`;
  url += `&country=${country}&limit=25`;
  console.log(url);
  const response = await fetch(url, {
    mode: "no-cors",
    headers: {
      Accept: "*/*",
    },
  });
  return new Response(JSON.stringify(await response.json()));
}
