import React,{useState,useEffect} from 'react';
import DatePicker from 'react-datepicker';
import Moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import styles from './styles.module.css';

function Sunset() {

    const [date, setDate] = useState(new Date());
    const [countryCode, setCountryCode] = useState(0);

    const [countries, setCountries] = useState([]);
    const [result, setResult] = useState([]);

    async function getSunriseSunset() {
        if (countryCode !== 0) {
            let country = countries.find(x => x.code === countryCode);

            const result = await fetch('https://api.sunrise-sunset.org/json' +
                '?lat=' + country.latitude +
                '&lng=' + country.longitude +
                '&date=' + Moment(date).format('YYYY-MM-DD')
            )

            const data = await result.json();

            if (data.status === 'OK'){
                setResult(data.results);
            }
        }
    }

    const getCountries = () => {
        fetch('data.json'
            ,{
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        .then(function(response){
            return response.json();
        })
        .then(function(response) {
            setCountries(response)
        });
    }

    useEffect(() => {
        getCountries()
    },[])

    return <div className={styles.container}>

        <div className={styles.row}>
            <DatePicker selected={date} onChange={(date) => { setDate(date); setResult([]); }} />

            <select value={countryCode} onChange={(e) => { setCountryCode(e.target.value); setResult([]); }}>
                <option value="0">Select country ..</option>
                {
                    countries && countries.length > 0 &&
                    countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)
                }
            </select>
        </div>

            <div>
                <button onClick={getSunriseSunset}>Show</button>
            </div>



            {result.sunrise && result.sunset &&
                <div> 
                   <div><img src='/images/rise.png' alt='Sunrise' width='50' height='50'/>
                        Sunrise is at {Moment(result.sunrise, "HH:mm:ss A").format("HH:mm")}
                    </div>
                    <div><img src='/images/set.png' alt='Sunset' width='50' height='50'/>
                        Sunset is at {Moment(result.sunset, "HH:mm:ss A").format("HH:mm")}
                    </div>
                </div>
            }

    </div>;
}

export default Sunset;