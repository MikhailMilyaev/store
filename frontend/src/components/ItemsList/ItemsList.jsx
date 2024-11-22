import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classes from './ItemsList.module.css'


const ItemsList = () => {
    const [items, setItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState(3); 
    const navigate = useNavigate();


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('/api/items', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setItems(response.data);

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [navigate]);

    const showMoreItems = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 3);
    };

    return (
        <div className={classes.cardList}>
            <div className={classes.cardGrid}>
                {items.slice(0, visibleItems).map(item => (
                    <div key={item.id} className={classes.cardItem}> 
                        <img src={item.image} alt={item.name} className={classes.cardImage} />
                        <h2 className={classes.cardName}>{item.name}</h2>
                        <p className={classes.cardDescription}>{item.description}</p>
                        <p className={classes.cardPrice}>{item.price}</p>
                    </div>
                ))}
            </div>
            {visibleItems < items.length && (
                <button onClick={showMoreItems} className={classes.showMoreButton}>
                    Показать еще
                </button>
            )}
        </div>
    );
};


export default ItemsList;