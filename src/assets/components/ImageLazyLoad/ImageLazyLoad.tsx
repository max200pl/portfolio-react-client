import { Blurhash } from "react-blurhash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import s from "./ImageLazyLoad.module.scss";
import { useState } from "react";
import Loader from "../Loader/Loader";

interface ImageLazyLoadProps {
    url?: string;
    name?: string;
    mixin?: string;
    blurHash?: string | undefined;
}

export default function ImageLazyLoad({
    url = "",
    name = "",
    mixin = "",
    blurHash = undefined,
}: ImageLazyLoadProps) {
    const [isLoaded, setLoaded] = useState(false);

    const handleLoad = () => {
        setLoaded(true);
    };

    return (
        <div className={s.img} data-mixin={mixin}>
            <LazyLoadImage
                className={s.img__lazy_load}
                key={name}
                src={url}
                onLoad={handleLoad}
            />

            {!isLoaded && <Loader />}

            {!isLoaded && blurHash && (
                <Blurhash
                    className={s.img__blurHash}
                    hash={blurHash}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                />
            )}
        </div>
    );
}
