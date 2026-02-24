import type { Route } from 'next';
import { Home, PlaySquare, Tag, Search, Heart, User } from 'lucide-react';

export const navItems = [
  { href: '/' as Route, label: 'Главная', icon: Home },
  { href: '/shorts' as Route, label: 'Shorts', icon: PlaySquare },
  { href: '/categories' as Route, label: 'Категории', icon: Tag },
  { href: '/search' as Route, label: 'Поиск', icon: Search },
  { href: '/favorites' as Route, label: 'Избранное', icon: Heart },
  { href: '/profile' as Route, label: 'Профиль', icon: User }
];

