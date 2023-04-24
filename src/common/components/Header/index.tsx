import { FaSolidClipboardList } from 'solid-icons/fa'
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
                <div class="h-[80px] bg-gray-800 flex items-center px-6 justify-between">
                    <A href="/">
                        <LogoSvg height={50} />
                    </A>
                    <div class="flex gap-3">
                        <A href="/worksheet" title="Logout" class="bg-gray-900 p-3 rounded-full hover:bg-gray-700">
                            <FaSolidClipboardList size={20} />
                        </A>
                        <button
                            onClick={handleSignOut}
                            title="Logout"
                            class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                        >
                            <FiLogOut size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header
