import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { DashboardSummaryResponse } from '../../interfaces'
import { shopApi } from '@/api'
import { SummaryTile } from '@/components/admin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartSimple, faClock, faCreditCard, faUsers } from '@fortawesome/free-solid-svg-icons'

const DashboardPage = () => {
    
    const fetcher = (url: string) => shopApi.get(url).then(res => res.data);
    const { data, error, isLoading } = useSWR<DashboardSummaryResponse>(
        '/products/admin/dashboard',
        fetcher
    );
    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(()=>{
          setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
        }, 1000 );
      
        return () => clearInterval(interval)
      }, []);

    if ( !data && !error ) return (
        <AdminLayout 
        title={`Error`} 
        subTitle={'Algo salio mal'}
    ><></></AdminLayout>
    );
    const {
        numberOfOrders,
        numberOfClients,
        numberOfProducts,
    } = data!;
    return (
        <AdminLayout
            title='Dashboard'
            subTitle='Estadísticas generales'
        >
            <div className='h-screen'>
                <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>

                    <SummaryTile 
                        title="Ordenes totales"
                        subTitle={ numberOfOrders }
                        icon={ <FontAwesomeIcon icon={faCreditCard} className="fa-2x mx-2 text-purple-500" /> }
                    />

                    <SummaryTile 
                        title="Clientes"
                        subTitle={ numberOfClients }
                        icon={ <FontAwesomeIcon icon={faUsers} className="fa-2x mx-2 text-indigo-500" /> }
                    />

                    <SummaryTile 
                        title="Productos"
                        subTitle={ numberOfProducts }
                        icon={ <FontAwesomeIcon icon={faChartSimple} className="fa-2x mx-2 text-pink-500" /> }
                    />

                    <SummaryTile 
                        title="Actualización en:"
                        subTitle={ refreshIn }
                        icon={ <FontAwesomeIcon icon={faClock} className="fa-2x mx-2 text-purple-500" /> }
                    />

                </div>
            </div>

        </AdminLayout>
    )
}

export default DashboardPage;
