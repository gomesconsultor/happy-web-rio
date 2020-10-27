import React, { useEffect, useState } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';


import 'leaflet/dist/leaflet.css';

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/orphanages-map.css';
import api from '../services/api';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2]
})

const OrphanagesMap: React.FC = () => {
  // 1 parametro - qual ação que eu quero executar
  // 2 parametro - quando eu quero executar
  interface Orphanage {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  }
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  
  
  useEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages (response.data);
    });

  },[]);
  return (
      <div id="page-map">
        <aside>
          <header>
            <img src={mapMarkerImg} alt="Happy" />
  
            <h2>Escolha um orfanato no mapa</h2>
            <p>Muitas crianças estão esperando a sua visita :)</p>
          </header>
  
          <footer>
            <strong>Rio de Janeiro</strong>
            <span>Rio de Janeiro</span>
          </footer>
        </aside>
  
        <Map
          center={[-22.9131326,-43.2459827]}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
          >
             {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
             <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}          />
             {orphanages.map(orphanage => {
               return (
                <Marker 
                   icon={mapIcon} 
                   position={[orphanage.latitude, orphanage.longitude]}
                   key={orphanage.id}
                   >
                <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                  {orphanage.name}
                  <Link to={`/orphanages/${orphanage.id}`} >
                    <FiArrowRight size={20} color="#FFF" />
                  </Link>
                </Popup>
               </Marker>     

               )
             })}  
          </Map>
      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF"/>
      </Link>
    </div>
    
  );
}

export default OrphanagesMap;