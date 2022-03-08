/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: 'offers',
    title: 'My Offers',
    type: 'basic',
    icon: 'heroicons_outline:chart-pie',
    link: '/offers',
  },
  {
    id: 'student-search',
    title: 'Advanced student search',
    type: 'basic',
    icon: 'mat_outline:bolt',
    link: '/student-search',
    hidden: (): boolean => true,
  },
];
export const compactNavigation: FuseNavigationItem[] = [
  {
    id: 'example',
    title: 'Example',
    type: 'basic',
    icon: 'heroicons_outline:chart-pie',
    link: '/example',
  },
];
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: 'example',
    title: 'Example',
    type: 'basic',
    icon: 'heroicons_outline:chart-pie',
    link: '/example',
  },
];
export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: 'example',
    title: 'Example',
    type: 'basic',
    icon: 'heroicons_outline:chart-pie',
    link: '/example',
  },
];
