import { ShopLayout } from "../components/layouts";

const Custom404 = () => {
  return (
    <ShopLayout title='Page not found' pageDescription='No hay nada que mostrar aquí'>
        <div style={{ height: 'calc(100vh - 110px)' }} className='w-full flex place-content-center justify-center text-black dark:text-white'>
            <h1 className='text-7xl mt-52'>404 |</h1>
            <h2 className='text-5xl pt-5 mt-52'>No encontramos ninguna página aquí</h2>
        </div>
    </ShopLayout>
  )
}

export default Custom404;