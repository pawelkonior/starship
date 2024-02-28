import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';

import StarshipLogo from 'assets/starship_logo.svg';
import { useAuth } from 'hooks/useAuth.js';
import StarCoin from 'components/Currency/StarCoin.jsx';

const pages = [
  {
    to: '/dodaj-kurs',
    name: 'Dodaj kurs',
  },
];

const settings = [
  {
    to: '/uzytkownik',
    name: 'Twój profil',
  },
  {
    to: '/wyloguj-sie',
    name: 'Wyloguj się',
  },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const userPages = [
    {
      to: `/asystent`,
      name: 'Chat z asystentem AI',
    },
    {
      to: `/portfolio/${user?.id}`,
      name: 'Portfolio',
    },
    {
      to: '/oferty',
      name: 'Oferty Pracy',
    },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'background.main',
        boxShadow: 0,
        borderBottom: '2px solid',
        borderColor: 'primary.light',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          pr: {
            xs: 2,
            lg: 0,
          },
          pl: {
            xs: 0,
            md: 2,
            lg: 0,
          },
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to="/" style={{ display: 'flex' }}>
              <img src={StarshipLogo} alt="Starship Logo" height={35} />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& > *, a': {
                  textDecoration: 'none',
                  color: 'text.primary',
                  textTransform: 'uppercase',
                },
              }}
            >
              {pages.map((page) => (
                <MenuLinkItem key={page?.to} to={page?.to} name={page?.name}>
                  {page}
                </MenuLinkItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', sm: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to="/" style={{ display: 'flex' }}>
              <img src={StarshipLogo} alt="Starship Logo" height={30} />
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              '& > *': {
                textDecoration: 'none',
                color: 'text.primary',
                textTransform: 'uppercase',
              },
            }}
          >
            {pages.map((page) => (
              <MenuLinkItem key={page?.to} to={page?.to} name={page?.name}>
                {page}
              </MenuLinkItem>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: {
                xs: 0,
                md: 2,
              },
              '& > *': {
                textDecoration: 'none',
                color: 'text.primary',
                textTransform: 'uppercase',
              },
            }}
          >
            {!user ? (
              <>
                <MenuLinkItem to={'/zarejestruj-sie'} name="Zarejestruj się" />
                <MenuLinkItem
                  to={'/zaloguj-sie'}
                  name="Zaloguj się"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'text.contrast',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      color: 'text.contrast',
                    },
                  }}
                />
              </>
            ) : (
              <>
                {userPages.map((page) => (
                  <MenuLinkItem
                    key={page?.to}
                    to={page?.to}
                    name={page?.name}
                    sx={{
                      p: {
                        xs: 1,
                        md: '8px 16px',
                      },
                    }}
                  />
                ))}
              </>
            )}
          </Box>
          {user ? <StarCoin value={user?.score} /> : null}

          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Konto">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.first_name?.charAt(0)}
                    src={user?.avatar}
                    sx={{
                      fontSize: '1.25rem',
                      bgcolor: 'primary.light',
                      color: 'primary.dark',
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting?.name}
                    onClick={() => {
                      if (setting?.name === 'Wyloguj się') {
                        logoutUser();
                      } else {
                        handleCloseUserMenu();
                        navigate(setting?.to);
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting?.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const MenuLinkItem = ({ to, name, sx }) => {
  return (
    <Link to={to}>
      <MenuItem sx={{ borderRadius: '4px', color: 'text.primary', ...sx }}>
        <Typography textAlign="center" sx={{ fontSize: '.875rem' }}>
          {name}
        </Typography>
      </MenuItem>
    </Link>
  );
};

export default Navbar;
