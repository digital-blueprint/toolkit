export const getAssetURL = (path) => {
    const elm = document.getElementById('vpu-library-shelving-wc-src');
    if (!elm)
        return path;
    const url = elm.src;
    // newer browsers only
    //var url = import.meta.url;
    return new URL(path, url).href;
};
