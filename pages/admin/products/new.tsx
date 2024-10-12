import { useEffect, useState } from 'react';
import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { shopApi } from '../../../api';
import { useSnackbar, VariantType } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCloudArrowUp, faPenToSquare, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { ImageUpload } from '@/components/products';
import { capitalize } from '@/utils/capitalize';

const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']


interface FormData {
    description: string;
    stock      : number;
    price      : number;
    sizes      : string[];
    slug       : string;
    tags       : string[];
    title      : string;
    gender     : string;
}


interface Props {
    product: IProduct;
    isNew: boolean;
}
const ProductAdminPage:NextPage<Props> = ({ product, isNew }) => {

    const router = useRouter();
    const [ newTagValue, setNewTagValue ] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: {
            title: '',
            description: '',
            price: 0,
            stock: 0,
            tags: [],
            gender: 'men',
            sizes: ['XS'],
            slug: '',
        }
    })

    const notify = (message: string, type: VariantType, slug?: string) => {
        enqueueSnackbar(message, {
            variant: type,
            autoHideDuration: 2500,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }
        })
        if( slug ) router.push('/admin/products/edit/' + slug)
    }

    useEffect(() => {
      const subscription = watch(( value, { name, type } ) => {
          if ( name === 'title' ) {
              const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .replace(/[^a-zA-Z0-9_]/g, '')
                    .toLocaleLowerCase() || '';

               setValue('slug', newSlug);
          }
      });
      return () => subscription.unsubscribe();
    }, [watch, setValue])
    
    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');

        if ( currentTags.includes(newTag) ) {
            return;
        }

        currentTags.push(newTag);
    }

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag );
        setValue('tags', updatedTags, { shouldValidate: true });
    }

    const onSubmit = async( form: FormData ) => {
        if (selectedFiles.length < 2) {
            notify('Selecciona al menos 2 imágenes', 'error')
            return;
        }
        setIsSaving(true);
        try {
            const formData = new FormData();
            selectedFiles.forEach((image: File) => {
                formData.append('images', image);
            });
            
            const _form = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
            }
            //Guardar producto
            const { data } = await shopApi.post('/products', _form);
            //Guardar imagenes
            await shopApi.post(`/files/product/${data.id}`, formData);
            notify('Producto guardado correctamente', 'success', data.slug )
        } catch (error) {
            setIsSaving(false);
            console.log(error);
            notify('Error al crear el producto', 'error');
        }

    }

    return (
        <AdminLayout 
            title={'Producto'} 
            autoHeight={true}
            subTitle="Creando un nuevo producto"
            icon={ <FontAwesomeIcon icon={faPenToSquare} className="fa-fw mx-2" /> }
        >
            <form onSubmit={ handleSubmit( onSubmit ) }>
                <div className='flex justify-end my-4'>
                    <button
                        className='py-2 disabled:opacity-70 px-5 rounded-full bg-indigo-600 text-white'
                        type="submit"
                        disabled={ isSaving }
                    >
                        {
                            isSaving ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="fa-fw mx-2 animate-spin" />
                                    Guardando
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCloudArrowUp} className="fa-fw mx-2" />
                                    Guardar
                                </>
                            )
                        }
                    </button>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    {/* Data */}
                    <div className='flex flex-col space-y-4'>
                        <div className='relative'>
                            <input
                                id='floating_title'
                                placeholder=''
                                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                                { ...register('title', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                            />
                            <label htmlFor="floating_title" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Title</label>
                            {errors.title && <p>{errors.title.message}</p>}
                        </div>
                        
                        <div className='relative'>
                            <textarea
                                id='floating_description'
                                placeholder=''
                                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                                rows={6}
                                { ...register('description', {
                                    required: 'Este campo es requerido',
                                })}
                            />
                            <label htmlFor="floating_description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                            {errors.description && <p>{errors.description.message}</p>}
                        </div>
                        
                        <div className='relative'>
                            <input
                                id='floating_inStock'
                                placeholder=''
                                type='number'
                                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                                { ...register('stock', {
                                    required: 'Este campo es requerido',
                                    min: { value: 0, message: 'Mínimo de valor cero' }
                                })}
                            />
                            <label htmlFor="floating_inStock" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Inventario</label>
                            {errors.stock && <p>{errors.stock.message}</p>}
                        </div>
                        
                        <div className='relative'>
                            <input
                                id="floating_price"
                                placeholder=''
                                type='number'
                                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                                { ...register('price', {
                                    required: 'Este campo es requerido',
                                    min: { value: 0, message: 'Mínimo de valor cero' }
                                })}
                            />
                            <label htmlFor="floating_price" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Price</label>
                            {errors.price && <p>{errors.price.message}</p>}
                        </div>

                        <hr />

                        {/* <div className='relative'>
                            <p className='mb-2 text-black dark:text-white font-semibold'>Tipo</p>
                            <fieldset>
                                <div className="flex space-x-6">
                                    {
                                        validTypes.map( option => (
                                            <div className='flex items-center mb-4'>
                                                <input 
                                                    id={option} 
                                                    type="radio" 
                                                    value={option} 
                                                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" 
                                                    { ...register('type', {
                                                        required: 'Este campo es requerido',
                                                    })}
                                                    checked={option === getValues('type') ? true : false }
                                                    onChange={ ({ target })=> setValue('type', target.value, { shouldValidate: true }) }
                                                />
                                                <label htmlFor={option} className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {capitalize(option)}
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </fieldset>
                        </div> */}

                        <div className='relative'>
                            <p className='mb-2 text-black dark:text-white font-semibold'>Género</p>
                            <fieldset>
                                <div className="flex space-x-6">
                                    {
                                        validGender.map( option => (
                                            <div className='flex items-center mb-4'>
                                                <input 
                                                    id={option} 
                                                    type="radio" 
                                                    value={option} 
                                                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" 
                                                    { ...register('gender', {
                                                        required: 'Este campo es requerido',
                                                    })}
                                                    checked={option === getValues('gender') ? true : false }
                                                    onChange={ ({ target })=> setValue('gender', target.value, { shouldValidate: true }) }
                                                />
                                                <label htmlFor={option} className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {capitalize(option)}
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </fieldset>
                        </div>

                        <div className='relative'>
                            <label className='text-black dark:text-white font-semibold'>Tallas</label>
                            <fieldset>
                                <div className="flex space-x-6 flex-wrap">
                                    {
                                        validSizes.map( option => (
                                            <div className='flex items-center mb-4'>
                                                <input 
                                                    id={option} 
                                                    type="checkbox" 
                                                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" 
                                                    { ...register('sizes', {
                                                        required: 'Este campo es requerido',
                                                    })}
                                                    value={option} 
                                                    onChange={ ({ target }) => {
                                                        const currentSizes = getValues('sizes') || [];
                                                        const newSizes = target.checked
                                                            ? [...currentSizes, target.value]  // Agregar valor si está seleccionado
                                                            : currentSizes.filter(size => size !== target.value);  // Eliminar valor si está deseleccionado
                                        
                                                        setValue('sizes', newSizes, { shouldValidate: true });
                                                    }}
                                                />
                                                <label htmlFor={option} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {option}
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    {/* Tags e imagenes */}
                    <div className='flex flex-col space-y-4'>
                        <div className='relative'>
                            <input
                                id='floating_slug'
                                placeholder=''
                                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                                { ...register('slug', {
                                    required: 'Este campo es requerido',
                                    validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios en blanco':undefined
                                })}
                            />
                            <label htmlFor="floating_slug" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Slug - URL</label>
                            {errors.slug && <p>{errors.slug.message}</p>}
                        </div>

                        <div className='relative'>
                            <input
                                id='floating_tags'
                                placeholder=''
                                value={ newTagValue }
                                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                                onChange={ ({ target }) => setNewTagValue(target.value) }
                                onKeyUp={ ({ code })=> code === 'Space' ? onNewTag() : undefined }
                            />
                            <label htmlFor="floating_tags" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Etiquetas</label>

                        </div>

                        <div className='relative'>
                            <ul className='flex flex-wrap space-x-3'>
                                {
                                    getValues('tags').map((tag) => {
                                        return (
                                            <li 
                                                key={tag}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                { tag }
                                                <span onClick={ () => onDeleteTag(tag)} className="cursor-pointer">
                                                    <FontAwesomeIcon icon={faCircleXmark} className="fa-fw ml-2" size="lg" />
                                                </span>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>

                        <hr />
    
                        <div className='relative'>
                            {/* <div className='flex flex-col'>
                                <label className='mb-2 text-black dark:text-white font-semibold'>Imagenes</label>
                                <button
                                    onClick={ () => fileInputRef.current?.click() }
                                    className='hover:underline'
                                >
                                    <FontAwesomeIcon icon={faCloudArrowUp} className="fa-fw mx-2" />
                                    Cargar imagen
                                </button>
                                <input 
                                    ref={ fileInputRef }
                                    type="file"
                                    multiple
                                    accept='image/png, image/gif, image/jpeg'
                                    style={{ display: 'none' }}
                                    onChange={ onFilesSelected }
                                />
                                <p className={`${ getValues('images').length < 2 ? 'block': 'hidden' } px-4 py-2 text-white bg-red-600 rounded-full flex justify-center`}> Es necesario al menos 2 imagenes"</p>
                            </div> */}
                            <div className='relative flex flex-wrap space-x-4 mt-5 '>
                                <ImageUpload 
                                    selectedFiles={selectedFiles}
                                    selectedImages={selectedImages}
                                    setSelectedFiles={setSelectedFiles}
                                    setSelectedImages={setSelectedImages}
                                />
                            </div>
                            
                            {/* {  
                                !isNew && (
                                    <div className='relative flex flex-wrap space-x-4 mt-5 '>
                                        {
                                            getValues('images').map( img => (
                                                <div className='w-[100px] flex flex-col'>
                                                    <div>
                                                        <img
                                                            className='fadeIn'
                                                            src={ img }
                                                            alt={ img }
                                                        />
                                                    </div>
                                                    <div>
                                                        <button 
                                                            className='w-full rounded-b-lg uppercase p-2 bg-transparent hover:bg-red-400 text-red-700 font-semibold'
                                                            onClick={()=> onDeleteImage(img)}
                                                        >
                                                            borrar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            } */}
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}


export default ProductAdminPage