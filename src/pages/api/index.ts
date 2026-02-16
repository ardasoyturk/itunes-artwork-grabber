import type { APIRoute } from "astro";
import type { countries, Entity } from "../../constants";

type CountryType = keyof typeof countries;

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams;

  let entity = (params.get("entity") as Entity) || "tvSeason";
  const country = (params.get("country") as CountryType) || "us";
  const query = params.get("query");
  let shortFilm = false;

  if (!query) {
    return Response.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  if (entity === "shortFilm") {
    shortFilm = true;
    entity = "movie";
  }

  let requestUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}`;
  if (shortFilm) {
    requestUrl += "&attribute=shortFilmTerm";
    entity = "shortFilm";
  }

  if (entity === "id" || entity === "idAlbum") {
    requestUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(query)}`;
  }

  requestUrl += `&country=${country}&limit=25`;

  const response = await fetch(requestUrl, {
    headers: {
      Accept: "*/*",
    },
  });

  const body = await response.json().catch(() => ({
    error: "Could not parse iTunes response",
  }));

  return Response.json(body, {
    status: response.ok ? 200 : response.status,
  });
};
