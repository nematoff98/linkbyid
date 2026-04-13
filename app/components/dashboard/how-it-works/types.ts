export interface HowItWorksStep {
  id: string
  title: string
  body: string[]
  imageSrc: string
  imageAlt: string
}

export interface HowItWorksSectionIntro {
  title: string
  description: string
}

export interface HowItWorksFetchGuide {
  title: string
  intro: string[]
  imageSuccessSrc: string
  imageFailSrc: string
  successCaption: string
  failCaption: string
}
