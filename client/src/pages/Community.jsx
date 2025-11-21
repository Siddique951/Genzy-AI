import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
    const [creations, setCreations] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const fetchCreations = async () => {
        try {
            const { data } = await axios.get('/api/user/get-published-creations', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });
            if (data.success) {
                setCreations(data.creations);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    const imageLikeToggle = async (id) => {
        try {
            const { data } = await axios.post('/api/user/toggle-like-creations', { id }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                toast.success(data.message);
                await fetchCreations();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            fetchCreations();
        }
    }, [user]);

    return (
        <div className="flex-1 h-full flex flex-col gap-4 p-6">
            <h2 className="text-lg font-semibold">Creations</h2>

            <div className="bg-white h-full w-full rounded-xl overflow-y-scroll p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creations.map((creation, index) => (
                    <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        {/* Image */}
                        <img
                            src={creation.content}
                            alt="AI Creation"
                            className="w-full h-80 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg p-4">
                            <p className="text-sm text-white mb-2 leading-tight">
                                {creation.prompt}
                            </p>

                            <div className="flex items-center justify-end gap-2 text-white">
                                <p className="text-sm">{creation.likes.length}</p>
                                <Heart onClick={() => imageLikeToggle(creation.id)}
                                    className={`min-w-5 h-5 cursor-pointer transition-transform hover:scale-110 ${creation.likes.includes(user?.id)
                                        ? "fill-red-500 text-red-600"
                                        : "text-white"
                                        }`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
