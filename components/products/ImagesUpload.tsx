import React, { useState } from 'react';
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface Props {
  selectedImages: string[];
  setSelectedImages: (selectedImages: string[]) => void;
  selectedFiles: File[];
  setSelectedFiles: (selectedFiles: File[]) => void;
}

export const ImageUpload: React.FC<Props> = ({ selectedFiles, selectedImages, setSelectedFiles, setSelectedImages }) => {
  // Manejar las imágenes seleccionadas
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.target.files || []);
  
    setSelectedFiles([...selectedFiles, ...newFiles]);
    // Crear previsualizaciones de las nuevas imágenes
    Promise.all(
      newFiles.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);   

          };
        });
      })
    ).then((newUrls) => {
      setSelectedImages([...selectedImages, ...newUrls]);
    });

    // Limpiar el input para permitir nuevas selecciones
    e.target.value = '';
  };

  // Eliminar una imagen de la lista y la previsualización
  const handleRemoveImage = (index: number) => {
    // Crear nuevas copias de los arreglos para evitar mutaciones directas
    const newSelectedImages = [...selectedImages];
    const newSelectedFiles = [...selectedFiles];

    // Eliminar la URL y el archivo en las posiciones correspondientes
    newSelectedImages.splice(index, 1);
    newSelectedFiles.splice(index, 1);

    // Actualizar los estados
    setSelectedImages(newSelectedImages);
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <div className='w-full'>
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF</p>
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              multiple
              accept='image/png, image/gif, image/jpeg'
              className="hidden"
              onChange={ handleImageChange }
            />
        </label>
      </div>

      <div>
        {selectedImages.length > 0 && (
          <div className='flex flex-col mt-3'>
            <label className='dark:text-white my-2 text-black font-semibold' htmlFor="">Imagenes a subir</label>
            <div className='relative flex flex-wrap space-x-4'>
              {selectedImages.map((preview, index) => (
                <div key={index} className='flex flex-col w-[150px]'>
                  <div>
                      <img
                          className='fadeIn w-full h-[150px] object-cover'
                          src={ preview }
                          alt="Img preview"
                      />
                  </div>
                  <div>
                      <button 
                          className='w-full rounded-b-lg uppercase p-2 bg-transparent hover:bg-red-400 text-red-700 font-semibold'
                          type='button'
                          onClick={()=> handleRemoveImage(index)}
                      >
                          borrar
                      </button>
                  </div>
                </div>
              ))}
            </div>  
          </div>
        )}
      </div>

    </div>
  );
};
