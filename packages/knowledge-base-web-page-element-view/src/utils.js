export const getAssetURL = (path) => {
        const elm = document.getElementById('vpu-knowledge-base-web-page-element-view-wc-src');
        if (!elm)
                return path;
        const url = elm.src;
        // newer browsers only
        //var url = import.meta.url;
        return new URL(path, url).href;
};
