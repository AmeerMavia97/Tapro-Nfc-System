import { ArrowRight, Star } from 'lucide-react'
import React from 'react'

const CustomerReview = () => {
    return (
        <section id="reviews" className="py-24 bg-[#fbfbf7]">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8 items-end">
                    <div>
                        <p className="text-xs font-bold text-gray-500">Our reviews</p>
                        <h2 className="mt-3 font-head text-[43px] md:text-5xl font-black tracking-tight">
                            Customer Success Stories
                        </h2>
                    </div>

                    <div className="lg:col-span-2 flex justify-end">
                        <p className="max-w-md text-gray-500">
                            Business owners use TAPro to make review collection easier,
                            faster, and more consistent.
                        </p>
                    </div>
                </div>

                <div className="mt-14 grid md:grid-cols-3 gap-6">
                    <StoryCard
                        quote="Customers can tap the stand and go straight to our review page. It made asking for reviews much easier."
                        name="Rachel S."
                        role="Salon Owner"
                    />
                    <StoryCard
                        quote="We placed the stand near checkout and started getting more reviews without chasing customers."
                        name="Mark L."
                        role="Restaurant Manager"
                    />
                    <StoryCard
                        quote="The setup was simple, and now our team can guide customers to leave a review in seconds."
                        name="Amanda K."
                        role="Clinic Manager"
                    />
                </div>

                <div className="mt-10 flex justify-center gap-3">
                    <button className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center">
                        <ArrowRight size={16} className="rotate-180" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    )
}

const StoryCard = ({ quote, name, role }) => (
    <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-black/5">
        <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill="black" />
            ))}
        </div>
        <p className="text-xl leading-snug font-medium">“{quote}”</p>
        <div className="mt-10 flex items-center justify-between">
            <div>
                <h4 className="font-black">{name}</h4>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
            <span className="w-10 h-10 rounded-full bg-[#f2f2f0]" />
        </div>
    </div>
);


export default CustomerReview
