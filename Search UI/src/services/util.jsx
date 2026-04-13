import { mapParameters } from './settings';

export function downloadFile(fileName, fileData) {
    let fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
    let file = new Blob([fileData], { type: fileType });
    let url = window.URL.createObjectURL(file);

    let link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

function flattenGeometryCoordinates(coordinates) {
    return coordinates.reduce(function (flat, toFlatten) {
        return flat.concat(
            typeof toFlatten[0][0] === 'number'
                ? toFlatten
                : flattenGeometryCoordinates(toFlatten)
        );
    }, []);
}

export function getExtent(coordinates) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    flattenGeometryCoordinates(coordinates).forEach(([x, y]) => {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    });

    let xRange = maxX - minX;
    let yRange = maxY - minY;

    return [
        minX - xRange * mapParameters.boundingBoxMargin,
        minY - yRange * mapParameters.boundingBoxMargin,
        maxX + xRange * mapParameters.boundingBoxMargin,
        maxY + yRange * mapParameters.boundingBoxMargin
    ];
}

export function getDate(dateString) {
    let dateObject = new Date(dateString);
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    let day = dateObject.getDate();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    return year + '-' + month + '-' + day;
}
