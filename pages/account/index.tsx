import { ShopLayout } from '@/components/layouts'
import { AuthContext } from '@/context'
import moment from 'moment'
import { useContext } from 'react'

const Account = () => {
    const { user } = useContext( AuthContext )
    return (
        <ShopLayout title='Cuenta' pageDescription=''>
            <div className='p-4 pt-14 space-y-5 flex flex-col w-full'>
                <div className='p-4 rounded-lg w-[600px] w-min-[200px] bg-white dark:bg-zinc-800'>
                    <div className="flex items-center gap-4">
                        <img className="w-16 h-16 rounded-full" src={ user?.avatar } alt="Img" />
                        <div className="font-medium dark:text-white">
                            <div>{ user?.fullName }</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Creado: {moment.utc(user?.created_at).fromNow()}</div>
                        </div>
                    </div>
                </div>
                <div className='p-4 rounded-lg w-[600px] w-min-[200px] bg-white dark:bg-zinc-800'>
                    Información
                </div>
            </div>
        </ShopLayout>
    )
}

export default Account;
