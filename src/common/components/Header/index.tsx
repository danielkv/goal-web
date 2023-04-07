import { FiLogOut } from 'solid-icons/fi'

import { Component } from 'solid-js'

import LogoSvg from '@assets/logo.svg?component-solid'
import { FIREBASE_AUTH } from '@common/providers/firebase'
import { loggedUser, setLoggedUser } from '@contexts/user/user.context'
import { A } from '@solidjs/router'

const Header: Component = () => {
    const handleSignOut = () => {
        setLoggedUser(null)
        FIREBASE_AUTH.signOut()
    }

    return (
        <>
            {loggedUser() && (
                <div class="h-[80px] bg-gray-300 flex items-center px-6 justify-between">
                    <A href="/">
                        <LogoSvg height={50} />
                    </A>

                    <button
                        onClick={handleSignOut}
                        title="Logout"
                        class="bg-gray-100 p-3 rounded-full hover:bg-gray-600"
                    >
                        <FiLogOut size={20} />
                    </button>
                </div>
            )}
        </>
    )
}

export default Header
