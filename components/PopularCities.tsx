/**
 * @file Renders a section with a list of popular cities for quick adding.
 */
import React from 'react';
import { POPULAR_CITIES } from '../constants';

interface PopularCitiesProps {
    /** Callback function to add a new clock by its timezone. */
    addClock: (timezone: string) => void;
}

/**
 * The PopularCities component displays a "cloud" of city names.
 * Clicking a city name will add its corresponding clock to the pinned list.
 * The font size of the city can be varied based on the 'size' property in the constant data.
 */
const PopularCities: React.FC<PopularCitiesProps> = ({ addClock }) => {
    return (
        <div>
             <div className="bg-neutral-800 text-gray-300 p-8 rounded-2xl text-center">
                <h3 className="text-xl font-bold mb-4 text-white">Popular Cities</h3>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                     {POPULAR_CITIES.map(city => {
                        const sizeClasses = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
                        return <span 
                            key={city.name} 
                            onClick={() => addClock(city.timezone)} 
                            className={`cursor-pointer font-medium hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors ${sizeClasses[city.size - 1]}`}
                        >
                            {city.name}
                        </span>
                    })}
                </div>
             </div>
        </div>
    );
};

export default PopularCities;
