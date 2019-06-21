import { ZoomConfig } from '../interfaces/zoom-config.interface';

const STATIC_CONFIG: ZoomConfig = {
    cursor: 'pointer',
    zoomWindowOffsetX: 0,
    zoomWindowOffsetY: 0,
    scrollZoom: true,
}

export const ZOOM_MAX: ZoomConfig = {
    ...STATIC_CONFIG,
    zoomWindowFadeIn: 500,
    zoomWindowFadeOut: 500,
    zoomWindowWidth: 550,
    zoomWindowHeight: 350,
};

export const ZOOM_MID: ZoomConfig = {
    ...STATIC_CONFIG,
    zoomWindowFadeIn: 500,
    zoomWindowFadeOut: 500,
    zoomWindowWidth: 400,
    zoomWindowHeight: 250,
};

export const ZOOM_MIN: ZoomConfig = {
    // ...STATIC_CONFIG,
    zoomType: 'lens',
    lensShape: 'round',
    lensSize: 200,
    lensFadeIn: 500,
    lensFadeOut: 500,
};