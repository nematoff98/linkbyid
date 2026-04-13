import type { HowItWorksFetchGuide, HowItWorksSectionIntro, HowItWorksStep } from './types'

import img3 from '~/assets/img/dashboard/how-works/3.png'
import img4 from '~/assets/img/dashboard/how-works/4.png'
import img5 from '~/assets/img/dashboard/how-works/5.png'
import img6 from '~/assets/img/dashboard/how-works/6.png'
import img7 from '~/assets/img/dashboard/how-works/7.png'
import img8 from '~/assets/img/dashboard/how-works/8.png'

export const linksSection: HowItWorksSectionIntro = {
  title: 'Links',
  description:
    'Create product entries visitors can open from your public profile search. Each item has a URL, optional image, and description.',
}

export const linksStepsPartA: HowItWorksStep[] = [
  {
    id: 'l1',
    title: 'Add a link from the Links page',
    body: [
      'Use the add-link form on the Links page to attach a destination URL to a code.',
      'Fill in the fields and save—the link becomes available on your public profile according to your settings.',
    ],
    imageSrc: img3,
    imageAlt: 'Links page add-link form',
  },
  {
    id: 'l2',
    title: 'Product image: paste a URL or upload a file',
    body: [
      'The highlighted area covers Image URL and Upload image.',
      'Either paste a direct image address or upload a file from your device—use whichever source you have for the product thumbnail.',
    ],
    imageSrc: img4,
    imageAlt: 'Image URL and upload controls highlighted',
  },
]

export const fetchGuide: HowItWorksFetchGuide = {
  title: 'Fetch metadata from the product URL',
  intro: [
    'The URL field and Fetch button are called out in the first screenshot. Paste the product page link, then press Fetch.',
    'When possible, we pull title, description, and image from the page so you spend less time typing.',
    'The second screenshot shows what happens when automatic fetch fails: a notice such as “Could not fetch metadata. Please fill in manually” appears—complete the fields yourself.',
  ],
  imageSuccessSrc: img5,
  imageFailSrc: img6,
  successCaption: 'Fetch succeeded — review or edit the prefilled fields.',
  failCaption: 'Fetch unavailable — fill title, description, and image manually.',
}

export const linksStepsPartB: HowItWorksStep[] = [
  {
    id: 'l3',
    title: 'Description and affiliate disclosure',
    body: [
      'The Description field is where shoppers read about the product.',
      'If you use affiliate links, we recommend adding a short commission disclosure—for example the affiliate notice highlighted in the screenshot—so your audience knows you may earn a commission at no extra cost to them.',
    ],
    imageSrc: img7,
    imageAlt: 'Description textarea with affiliate disclosure example highlighted',
  },
  {
    id: 'l4',
    title: 'Edit or delete after the link exists',
    body: [
      'Once a link is saved, Edit and Delete stay available on the row.',
      'Use Edit to change the destination, code, copy, or image; use Delete to remove the link from your public profile.',
    ],
    imageSrc: img8,
    imageAlt: 'Link row with edit and delete actions highlighted',
  },
]
