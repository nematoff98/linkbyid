import type { HowItWorksSectionIntro, HowItWorksStep } from './types'

import img1 from '~/assets/img/dashboard/how-works/1.png'
import img2 from '~/assets/img/dashboard/how-works/2.png'
import imgProfileCopyLink from '~/assets/img/dashboard/how-works/two.png'

export const howItWorksIntro: HowItWorksSectionIntro = {
  title: 'How the dashboard works',
  description:
    'Short walkthrough of Profile and Links. Red highlights in each screenshot call out the controls being explained.',
}

export const profileSection: HowItWorksSectionIntro = {
  title: 'Profile',
  description:
    'Set your public identity and the link you share in social bios. Everything here updates your public page at /u/yourname.',
}

/** Shown as a warning callout before Profile steps — username is the required first action. */
export const profileUsernameFirstWarning = {
  title: 'Start with your username',
  description:
    'Choosing a username is the essential first step and should be done before anything else. Your public profile URL (/u/yourname) and the link you copy into social bios are built from it—set and save a username, then refine avatar and bio.',
} as const

export const profileSteps: HowItWorksStep[] = [
  {
    id: 'p1',
    title: 'Username and your public link',
    body: [
      'The highlighted fields are your username and the public profile URL you can copy.',
      'Choose a username first. The copy field shows how your bio link will look so you can paste it into TikTok, Instagram, or anywhere else.',
    ],
    imageSrc: img1,
    imageAlt: 'Profile settings with username and copy-link field highlighted',
  },
  {
    id: 'p1b',
    title: 'Copy your link and place it where followers will tap',
    body: [
      'The red highlight is the copy button for your public profile URL—one click copies the full link.',
      'Paste it wherever you need it: TikTok or Instagram bio, “link in bio” tools, video descriptions, or any profile field where you want people to open your page and search by code.',
    ],
    imageSrc: imgProfileCopyLink,
    imageAlt: 'Profile page with copy public link button highlighted',
  },
  {
    id: 'p2',
    title: 'Form on the left, live preview on the right',
    body: [
      'The arrow shows the relationship: values you enter in the Profile form appear in the preview on the right.',
      'Adjust username, avatar, or bio and confirm the preview matches what you want visitors to see before you move on.',
    ],
    imageSrc: img2,
    imageAlt: 'Profile editor with arrow from form to preview',
  },
]
