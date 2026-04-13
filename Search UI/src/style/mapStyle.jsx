import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

export const locationMarkerStyle = new Style({
    image: new CircleStyle({
        radius: 6,
        fill: new Fill({
            color: '#3399CC'
        }),
        stroke: new Stroke({
            color: '#fff',
            width: 2
        })
    })
});

export const getDataStyle = feature => {
    if (feature.getGeometry().getType() === 'Point') {
        if (feature.getProperties().type === 'orientation') {
            return new Style({
                image: new Icon({
                    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    scale: 0.05
                })
            });
        } else {
            return new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: '#0005'
                    }),
                    stroke: new Stroke({
                        color: '#000',
                        width: 2
                    })
                })
            });
        }
    } else {
        return new Style({
            fill: new Fill({
                color: '#0005'
            }),
            stroke: new Stroke({
                color: '#000',
                width: 2
            })
        });
    }
};

export const getFilterStyle = () => {
    return new Style({
        fill: new Fill({
            color: '#8005'
        }),
        stroke: new Stroke({
            color: '#800',
            width: 2
        })
    });
};
