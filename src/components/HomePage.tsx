import type { SubmitEvent } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { type CountryType, countries, type ItunesResult } from "../constants";
import "../styles/app.scss";

export default function HomePage() {
  const [result, setResult] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionUrl, setCollectionUrl] = useState("");
  const [highResImage, setHighResImage] = useState("");
  const [standardResImage, setStandardResImage] = useState("");
  const [trackName, setTrackName] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(false);

    const formData = new FormData(event.currentTarget);
    const entity = (formData.get("entity") as string) || "tvSeason";
    const country = (formData.get("country") as string) || "us";
    const query = ((formData.get("query") as string) || "").trim();

    if (!query) {
      toast("No input given. Please try again.", {
        type: "error",
        theme: "dark",
      });
      return;
    }

    const response = await fetch(
      `/api?${new URLSearchParams({
        entity,
        country,
        query,
      }).toString()}`,
    );

    const data = (await response
      .json()
      .catch(() => null)) as ItunesResult | null;

    if (!data?.results || !response.ok) {
      toast("An error occured. Please try again later.", {
        type: "error",
        theme: "dark",
      });
      return;
    }

    const foundResult = data.results[0];
    if (!foundResult) {
      toast("Could not get a result. Please try again later.", {
        type: "error",
        theme: "dark",
      });
      return;
    }

    setResult(true);
    setArtistName(foundResult.artistName);
    setCollectionName(foundResult.collectionName);
    setCollectionUrl(foundResult.collectionViewUrl);
    setTrackName(foundResult.trackName);
    setStandardResImage(
      foundResult.artworkUrl100.replace("100x100", "600x600"),
    );
    setHighResImage(
      foundResult.artworkUrl100.replace("100x100bb", "100000x100000-999"),
    );
  }

  return (
    <main className="flex min-h-screen w-screen flex-1 flex-col items-center justify-center bg-black text-white">
      <ToastContainer />
      <div className="my-auto">
        <section>
          <h1 className="text-center text-3xl font-semibold">
            iTunes Artwork Grabber
          </h1>
          <form
            className="mx-auto mt-5 flex w-5/6 flex-col gap-2 md:w-full lg:flex-row"
            onSubmit={handleSubmit}
          >
            <select name="entity" aria-label="Type selector">
              <option value="tvSeason">TV Show</option>
              <option value="movie">Movie</option>
              <option value="ebook">iBook</option>
              <option value="album">Album</option>
              <option value="software">App (iPhone or Universal)</option>
              <option value="iPadSoftware">App (iPad)</option>
              <option value="macSoftware">App (macOS)</option>
              <option value="audiobook">Audiobook</option>
              <option value="podcast">Podcast</option>
              <option value="musicVideo">Music Video (may not work)</option>
              <option value="id">Apple ID (Movie)</option>
              <option value="idAlbum">Apple ID (Album)</option>
              <option value="shortFilm">Short Film</option>
            </select>
            <input type="text" name="query" placeholder="ID / Search term" />
            <select name="country" aria-label="Country selector">
              <option value="us">United States of America</option>
              <option value="gb">United Kingdom</option>
              {Object.keys(countries)
                .filter((c) => !["us", "gb"].includes(c))
                .map((c) => (
                  <option key={c} value={c}>
                    {countries[c as CountryType]}
                  </option>
                ))}
            </select>
            <button type="submit" className="px-2">
              Do the magic
            </button>
          </form>
        </section>
        {result ? (
          <section className="mt-4 flex flex-col items-center justify-center space-y-2 text-2xl font-medium">
            {collectionName && artistName ? (
              <h1 className="text-center text-green-200">
                Found:{" "}
                <a
                  href={collectionUrl || "https://google.com"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="text-yellow-200">{artistName}</span>{" "}
                  <span className="text-white">-</span>{" "}
                  <span className="text-yellow-200">
                    {trackName || collectionName}
                  </span>
                </a>
              </h1>
            ) : null}
            <div className="w-5/6 text-center text-red-300 sm:w-full">
              <a href={highResImage} target="_blank" rel="noreferrer">
                Uncompressed High Resolution
              </a>{" "}
              <span className="text-white">-</span>{" "}
              <a href={standardResImage} target="_blank" rel="noreferrer">
                Standard Resolution
              </a>
            </div>
          </section>
        ) : undefined}
      </div>

      <footer className="w-full py-2 text-center">
        Made by{" "}
        <a className="text-red-100" href="https://ardasoyturk.com">
          Arda Soyturk
        </a>
        , heavily inspired by{" "}
        <a
          className="text-red-100"
          href="https://bendodson.com/projects/itunes-artwork-finder/"
        >
          Ben Dodson&apos;s iTunes Artwork Finder.
        </a>
      </footer>
    </main>
  );
}
