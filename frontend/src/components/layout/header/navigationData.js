// src/components/layout/header/navigationData.js
import { 
  Calendar, Briefcase, GraduationCap, Award, 
  FileText, Camera, Home, BookOpen, Mail, Users
} from 'lucide-react';

export const mainNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: BookOpen },
  { name: 'Research', href: '/research', icon: BookOpen },
  { name: 'Contact', href: '/contact', icon: Mail }
];

export const hamburgerSections = [
  {
    title: 'Main',
    items: mainNavigation
  },
  {
    title: 'Committee',
    key: 'committee',
    icon: Users,
    items: [
      { name: 'Executive Committee', href: '/committee/executive' },
      { name: 'Past Committee', href: '/committee/past' },
      { name: 'Former Chair', href: '/committee/former-chair' },
      { name: 'Section Chapter Representatives', href: '/committee/SCR-Team' }
    ]
  },
  {
    title: 'Events',
    key: 'events',
    icon: Calendar,
    items: [
      { name: 'Upcoming Events', href: '/events' },
      { name: 'Past Events', href: '/events/past' },
      { name: 'Workshops', href: '/events/workshops' },
      { name: 'Conferences', href: '/events/conferences' }
    ]
  },
  {
    title: 'Opportunities',
    key: 'opportunities',
    icon: Briefcase,
    items: [
      { name: 'Jobs', href: '/opportunities/jobs' },
      { name: 'Internships', href: '/opportunities/internships' },
      { name: 'Research Collaborations', href: '/opportunities/research' }
    ]
  },
  {
    title: 'Student Corner',
    key: 'student',
    icon: GraduationCap,
    items: [
      { name: 'Student Chapters', href: '/student/chapters' },
      { name: 'Projects', href: '/student/projects' },
      { name: 'Resources', href: '/student/resources' }
    ]
  },
  {
    title: 'Other',
    items: [
      { name: 'Awards', href: '/awards', icon: Award },
      { name: 'Newsletter', href: '/newsletter', icon: FileText },
      { name: 'Photo Gallery', href: '/gallery', icon: Camera }
    ]
  }
];