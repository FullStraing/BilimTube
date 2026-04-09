import type { Route } from 'next';
import { Home, PlaySquare, Tag, Search, Heart, User } from 'lucide-react';

export const navItems = [
  { href: '/' as Route, label: 'nav.home', icon: Home },
  { href: '/shorts' as Route, label: 'nav.shorts', icon: PlaySquare },
  { href: '/categories' as Route, label: 'nav.categories', icon: Tag },
  { href: '/search' as Route, label: 'nav.home', icon: Search },
  { href: '/favorites' as Route, label: 'nav.favorites', icon: Heart },
  { href: '/profile' as Route, label: 'nav.profile', icon: User }
];
