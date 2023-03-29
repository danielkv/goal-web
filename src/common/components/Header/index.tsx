import { Component } from 'solid-js'

import LogoSvg from '../../../assets/logo.svg?component-solid'

const Header: Component = () => {
    return (
        <div class="h-[80px] bg-gray-300 flex items-center px-6">
            <LogoSvg height={50} />
        </div>
    )
}

export default Header
