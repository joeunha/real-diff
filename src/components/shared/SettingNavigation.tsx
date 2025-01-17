import styled from '@emotion/styled'
import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'

import { SETTING_ROUTE_TYPE } from '@/constants/routes'

const StyledNavLink = styled(NavLink)`
  padding: 14px 0;
  flex: 1;
  text-align: center;

  &.active {
    color: #1CD98A;
    border-bottom: 2px solid #1CD98A;
  }
`

const StickyNav = styled.header`
  display: flex;
  justify-content: space-around;

  color: #B0B8C1;
  font-weight: bold;
`

export const SettingNavigation = () => {
  const match = useRouteMatch()

  return (
    <StickyNav>
      <StyledNavLink
        activeClassName='active'
        to={`${match.url}/${SETTING_ROUTE_TYPE.FILE_LIST}`}
      >
        Ignore
      </StyledNavLink >
      <StyledNavLink
        activeClassName='active'
        to={`${match.url}/${SETTING_ROUTE_TYPE.TOKEN}`}
      >
        Token
      </StyledNavLink >
    </StickyNav>
  )
}
