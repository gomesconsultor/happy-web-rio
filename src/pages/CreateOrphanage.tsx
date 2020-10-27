import React, { FormEvent, useState, ChangeEvent } from "react";
import  L from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import  { LeafletMouseEvent } from 'leaflet';
import { useHistory } from "react-router-dom";

import { FiArrowLeft, FiPlus } from "react-icons/fi";

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/create-orphanage.css';
import api from "../services/api";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

export default function CreateOrphanage() {
  const { goBack } = useHistory();
  const [position, setPosition] = useState({latitude: 0 , longitude: 0 });
  const history = useHistory();
  const [name , SetName] = useState('');
  const [about , SetAbout] = useState('');
  const [instructions , SetInstuctions] = useState('');
  const [opening_hours , SetOpenigHours] = useState('');
  const [open_on_weekends , SetOpenOnWeekend] = useState(true);

 const [images, setImages] = useState<File[]>([]);  

 const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  function handleMapClick(event: LeafletMouseEvent) {
    console.log(event.latlng);
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

async function handleSubmit(event: FormEvent ) {
    event.preventDefault();
    const { latitude, longitude} = position;

    const data = new  FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso');

    history.push('/app')

}


    


  


function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files) {
      return ;
    }  
    console.log(event.target.files)
    
   
    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectImagesPreview = selectedImages.map(image => {
       return URL.createObjectURL(image);
    });

    setPreviewImages(selectImagesPreview)
   
  }

  return (
    <div id="page-create-orphanage">
      <aside>
        <img src={mapMarkerImg} alt="Happy" />

        <footer>
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={24} color="#FFF" />
          </button>
        </footer>
      </aside>

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-22.9131326, -43.2459827]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude !== 0
               ? <Marker interactive={false} icon={happyMapIcon} position={[position.latitude,position.longitude]} /> 
               :  null
              } 
              {/* <Marker interactive={false} icon={happyMapIcon} position={[-27.2092052,-49.6401092]} /> */}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={ event => SetName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" value={about} onChange={ event => SetAbout(event.target.value)} maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

               <div className="images-container">
                 {previewImages.map(image => {
                    return (
                      <img key={image} src={image} alt={name} />
                    )
                 })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
               </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" 
               value={instructions}
               onChange={ event => SetInstuctions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={
                event => SetOpenigHours(event.target.value)
              } />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button"
                        className={open_on_weekends ? 'active' : '' }
                        onClick={() => SetOpenOnWeekend(true)}>
                          Sim</button>
                <button type="button"
                className={!open_on_weekends ? 'active' : ''}
                onClick={() => SetOpenOnWeekend(false)}
                >
                Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
