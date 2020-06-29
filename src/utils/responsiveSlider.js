// Breakpoints in pixels for limiting how many cards will be shown in Carousel.
export const responsive = {
	Yes: {
		breakpoint: {
			max: 10000, // pixels
			min: 2380,
		},
		items: 10, // amount of cards shown
	},
	FHDPlus: {
		breakpoint: {
			max: 2380,
			min: 2180,
		},
		items: 9,
	},
	FHD: {
		breakpoint: {
			max: 2180,
			min: 1980,
		},
		items: 8,
	},
	FHDMinus: {
		breakpoint: {
			max: 1980,
			min: 1780,
		},
		items: 7,
	},
	desktop: {
		breakpoint: {
			max: 1780,
			min: 1580,
		},
		items: 6,
	},
	HDPlus: {
		breakpoint: {
			max: 1580,
			min: 1380,
		},
		items: 5,
	},
	HDMinus: {
		breakpoint: {
			max: 1380,
			min: 1180,
		},
		items: 4,
	},
	tabletPlus: {
		breakpoint: {
			max: 1180,
			min: 980,
		},
		items: 3,
	},
	tabletMinus: {
		breakpoint: {
			max: 980,
			min: 780,
		},
		items: 2,
	},
	mobile: {
		breakpoint: {
			max: 780,
			min: 560,
		},
		items: 2,
	},
	mobileMinus: {
		breakpoint: {
			max: 560,
			min: 0,
		},
		items: 1,
	},
};
