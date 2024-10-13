import React, { useContext } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AuthContext, CartContext, UiContext } from '@/context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'


const navigation = [
    { name: 'Todo', href: '/'},
    { name: 'Hombre', href: '/category/men'},
    { name: 'Mujer', href: '/category/women' },
    { name: 'Niños', href: '/category/kid'},
]

function classNames(...classes:any[]) {
    return classes.filter(Boolean).join(' ')
}

export const Nav = () => {
    const { asPath } = useRouter();
    const { numberOfItems } = useContext( CartContext );
    const { theme, toggleTheme } = useContext( UiContext );
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    console.log(user)
    return (
        <Disclosure as="nav" className="bg-white dark:bg-zinc-900">
            <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href='/' passHref>
                                <img
                                    alt="Your Company"
                                    src="/shop.webp"
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        aria-current={ asPath === item.href ? 'page' : undefined}
                                        className={classNames(
                                            asPath === item.href ? ' text-black dark:text-white ring-2 ring-indigo-500' : 'dark:text-gray-300 dark:hover:bg-zinc-800 text-black hover:bg-gray-200',
                                        'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Link
                            href="/cart"
                            className="relative mx-2 rounded-full bg-transparent p-1 dark:text-gray-400 text-black dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View cart</span>
                            <span className='absolute top-[-8px] right-[-4px] p-[1px] terxt-black dark:text-white text-sm'>{ numberOfItems > 9 ? '+9': numberOfItems  }</span>
                            <ShoppingCartIcon aria-hidden="true" className="h-6 w-6" />
                        </Link>
                        <button
                            onClick={ toggleTheme }
                            className="relative mx-2 rounded-full bg-transparent p-1 dark:text-gray-400 text-black dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View cart</span>
                            {
                                theme === "dark" ? <FontAwesomeIcon icon={faMoon} size='xl' className='text-white' /> : <FontAwesomeIcon icon={faSun} size='xl' className='text-black' />
                            }
                        </button>
                        


                        {/* <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="h-6 w-6" />
                        </button> */}
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                        <div>
                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <img
                                    alt=""
                                    src={user?.avatar ?? '/default.png'}
                                    className="h-8 w-8 rounded-full"
                                />
                            </MenuButton>
                        </div>
                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-zinc-950 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            {
                                isLoggedIn && (
                                    <>
                                        {/* <MenuItem>
                                            <Link href="/account" className="block px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                                Mi cuenta
                                            </Link>
                                        </MenuItem> */}
                                        <MenuItem>
                                            <Link href="/orders/mine" className="block px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                                Mis pedidos
                                            </Link>
                                        </MenuItem>
                                    </>
                                )
                                        
                            }
                            {
                                (user?.roles.some(role => ['admin', 'SEO'].includes(role)))  && (
                                    <>
                                        <hr />
                                        <MenuItem>
                                            <Link href="/admin/" className="block px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                                Dashboard
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link href="/admin/products" className="block px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                                Productos
                                            </Link>
                                        </MenuItem>
                                        {/* <MenuItem>
                                            <Link href="/admin/orders" className="block px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                                Ordenes
                                            </Link>
                                        </MenuItem> */}
                                    </>
                                )
                            }
                            {/* {
                                user?.roles.includes('SEO') && (
                                    <MenuItem>
                                        <Link href="/admin/users" className="block px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                            Users
                                        </Link>
                                    </MenuItem>
                                )
                            } */}
                            {
                                isLoggedIn ? (
                                    <MenuItem>
                                        <button onClick={logout} className="w-full flex justify-start px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                            Salir
                                        </button>
                                    </MenuItem>
                                ) : (
                                    <MenuItem>
                                        <Link href={`/auth/login?p=${ asPath }`} className="block px-4 py-2 text-sm text-black dark:text-white dark:data-[focus]:bg-zinc-900 data-[focus]:bg-gray-100">
                                            Ingresar
                                        </Link>
                                    </MenuItem>
                                )
                            }
                        </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                    <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={asPath === item.href ? 'page' : undefined}
                    className={classNames(
                        asPath === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                    >
                    {item.name}
                    </DisclosureButton>
                ))}
                </div>
            </DisclosurePanel>
    </Disclosure>
    )
}
