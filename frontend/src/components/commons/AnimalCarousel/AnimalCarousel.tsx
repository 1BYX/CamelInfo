import './AnimalCarousel.css'
import React, { useEffect, useRef } from 'react'
import { Carousel } from 'react-responsive-carousel'
import ArrowLeft from '@mui/icons-material/ChevronLeftRounded';
import ArrowRight from '@mui/icons-material/ChevronRightRounded';
import ReactDOM from 'react'

interface AnimalCarouselProps {
    selectedItem: number
}


const AnimalCarousel: React.FC<AnimalCarouselProps> = ({ selectedItem }) => {

    return (
        <>
            <Carousel
                infiniteLoop
                showIndicators={false}
                showThumbs={false}
                showStatus={false}
                width="180px"
                renderArrowNext={renderArrowNext}
                renderArrowPrev={renderArrowPrev}
                selectedItem={selectedItem}
            >
                <div className="bear">
                    <img src={`../../../animalIcons/bear.png`} />
                    <p>Bear</p>
                </div>
                <div className="cat">
                    <img src={`../../../animalIcons/cat.png`} />
                    <p>Cat</p>
                </div>
                <div className="dog">
                    <img src={`../../../animalIcons/dog.png`} />
                    <p>Dog</p>
                </div>
                <div className="elephant">
                    <img src={`../../../animalIcons/elephant.png`} />
                    <p>Elephant</p>
                </div>
                <div className="fish">
                    <img src={`../../../animalIcons/fish.png`} />
                    <p>Fish</p>
                </div>
                <div className="giraffe">
                    <img src={`../../../animalIcons/giraffe.png`} />
                    <p>Giraffe</p>
                </div>
                <div className="lion">
                    <img src={`../../../animalIcons/lion.png`} />
                    <p>Lion</p>
                </div>
                <div className="mouse">
                    <img src={`../../../animalIcons/mouse.png`} />
                    <p>Mouse</p>
                </div>
                <div className="parrot">
                    <img src={`../../../animalIcons/parrot.png`} />
                    <p>Parrot</p>
                </div>
                <div className="rabbit">
                    <img src={`../../../animalIcons/rabbit.png`} />
                    <p>Rabbit</p>
                </div>
            </Carousel>
        </>
    )
}

export default AnimalCarousel

const renderArrowPrev = (clickHandler: () => void, hasPrev: boolean, label: string) => {
    return (
        <div className="arrow-left"><ArrowLeft onClick={clickHandler} fontSize="large" /></div>
    )
}

const renderArrowNext = (clickHandler: () => void, hasPrev: boolean, label: string) => {
    return (
        <div className="arrow-right"><ArrowRight onClick={clickHandler} fontSize="large" /></div>
    )
}
