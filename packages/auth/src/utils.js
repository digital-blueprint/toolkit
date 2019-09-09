export const getAssetURL = (path) => {
    const elm = document.getElementById('vpu-library-app-src');
    if (!elm)
        return path;
    const url = elm.src;
    // newer browsers only
    //var url = import.meta.url;
    return new URL(path, url).href;
};
