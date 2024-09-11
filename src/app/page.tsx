"use client";

import "../styles/app.scss";
import { countries, type CountryType, type ItunesResult } from "../constants";
import Link from "next/link";
import { useState } from "react";
import "react-toastify/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

export default function HomePage() {
  const [result, setResult] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionUrl, setCollectionUrl] = useState("");
  const [highResImage, setHighResImage] = useState("");
  const [standardResImage, setStandardResImage] = useState("");

  async function handleSubmit(formData: FormData) {
    setResult(false);
    const entity = formData.get("entity")! as string;
    const country = formData.get("country")! as string;
    const query = formData.get("query")! as string;

    if (!query) {
      return toast("No input given. Please try again.", {
        type: "error",
        theme: "dark",
      });
    }

    const response = await fetch(
      `/api?` +
        new URLSearchParams({
          entity: encodeURIComponent(entity),
          country: country,
          query: query,
        }).toString(),
    );
    const data = (await response.json()) as ItunesResult;
    if (!data.results || !response.ok) {
      return toast("An error occured. Please try again later.", {
        type: "error",
        theme: "dark",
      });
    }

    const foundResult = data.results[0];
    if (!foundResult) {
      return toast("Couldn't get a result. Please try again later.", {
        type: "error",
        theme: "dark",
      });
    }
    setResult(true);
    setArtistName(foundResult.artistName);
    setCollectionName(foundResult.collectionName);
    setCollectionUrl(foundResult.collectionViewUrl);
    setStandardResImage(
      foundResult.artworkUrl100.replace("100x100", "600x600"),
    );
    setHighResImage(
      foundResult.artworkUrl100.replace("100x100bb", "100000x100000-999"),
    );

    console.log(data);
  }
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center bg-black text-white">
      <ToastContainer />
      <section>
        <h1 className="text-center text-3xl font-semibold">
          iTunes Artwork Grabber
        </h1>
        <form
          className="mx-auto mt-5 flex w-5/6 flex-col gap-2 md:w-full lg:flex-row"
          action={handleSubmit}
        >
          <select name="entity" id="entity" className="">
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
          <input
            type="text"
            className=""
            name="query"
            id="query"
            placeholder="ID / Search term"
          />
          <select name="country" id="country" className="">
            <option value="us">United States of America</option>
            <option value="gb">United Kingdom</option>
            {Object.keys(countries)
              .filter((c) => !["us", "gb"].some((b) => b === c))
              .map((c, i) => (
                <option key={i} value={c}>
                  {countries[c as CountryType]}
                </option>
              ))}
          </select>
          <button className="px-2">Get the artwork</button>
        </form>
      </section>
      {result ? (
        <section className="mt-4 flex flex-col items-center justify-center space-y-2 text-2xl font-medium">
          {collectionName && artistName ? (
            <h1 className="text-center text-green-200">
              Found:{" "}
              <Link href={collectionUrl ?? "https://google.com"}>
                <span className="text-yellow-200">{artistName}</span>{" "}
                <span className="text-white">-</span>{" "}
                <span className="text-yellow-200">{collectionName}</span>
              </Link>
            </h1>
          ) : null}
          <div className="w-5/6 text-center text-red-300 sm:w-full">
            <Link href={highResImage}>Uncompressed High Resolution</Link>{" "}
            <span className="text-white">-</span>{" "}
            <Link href={standardResImage}>Standard Resolution</Link>
          </div>
        </section>
      ) : undefined}

      <footer className="absolute bottom-0 py-2">
        Made with ❤️ by{" "}
        <a className="text-red-100" href="https://ardasoyturk.dev">
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
