import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons'
import './Clock.css'; // Import your CSS file for styling

const FlipClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (value) => {
        return value.toString().padStart(2, '0');
    };

    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const seconds = formatTime(time.getSeconds());
    const day = time.getDate().toString().padStart(2, '0')
    const month = (time.getMonth() + 1).toString().padStart(2, '0')
    const year = time.getFullYear().toString()

    console.log(day)
    console.log(month)
    console.log(year)

    return (
        <div className="flip-clock-container">
            <div className="flip-clock" style={{ paddingRight: '4em' }}>
                {/* Month */}
                <div className="digit">
                    <div className="chevron-up">
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'1.2em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'1.2em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{month[0]}</div>
                            <div className="back">{(parseInt(month[0]) + 1) % 12}</div>
                        </div>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'1.2  em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{month[1]}</div>
                            <div className="back">{(parseInt(month[1]) + 1) % 12}</div>
                        </div>
                    </div>
                </div>
                {/* Day */}
                <div className="digit">
                <div className="chevron-up">
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'1.2em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'1.2em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{day[0]}</div>
                            <div className="back">{(parseInt(day[0]) + 1)}</div>

                        </div>
                    </div>
                    
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{day[1]}</div>
                            <div className="back">{(parseInt(day[1]) + 1)}</div>

                        </div>
                    </div>
                </div>
                {/* Year */}
                <div className="digit">
                <div className="chevron-up">
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'1.2em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up">
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'2.4em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'3.6em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'1.2em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'2.4em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'3.6em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{year[0]}</div>
                            <div className="back">{(parseInt(year[0]) + 1)}</div>
                        </div>

                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{year[1]}</div>
                            <div className="back">{(parseInt(year[1]) + 1)}</div>
                        </div>

                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{year[2]}</div>
                            <div className="back">{(parseInt(year[2]) + 1)}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{year[3]}</div>
                            <div className="back">{(parseInt(year[3]) + 1)}</div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flip-clock">
                {/* Hours */}
                <div className="digit">
                <div className="chevron-up">
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'1.2em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'1.2em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{hours[0]}</div>
                            <div className="back">{(parseInt(hours[0]) + 1) % 10}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{hours[1]}</div>
                            <div className="back">{(parseInt(hours[1]) + 1) % 10}</div>
                        </div>
                    </div>
                </div>
                {/* Minutes */}
                <div className="digit">
                    
                    <div className="chevron-up">
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'1.2em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'1.2em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{minutes[0]}</div>
                            <div className="back">{(parseInt(minutes[0]) + 1) % 10}</div>
                        </div>
                    </div>
                    <div className="lower">
                        <div className="card">
                            <div className="flipper">
                                <div className="front">{minutes[1]}</div>
                                <div className="back">{(parseInt(minutes[1]) + 1) % 10}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Seconds */}
                <div className="digit">
                <div className="chevron-up">
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-up" style={{paddingLeft:'1.2em'}}>
                        <ChevronUp color='black'/>
                    </div>
                    <div className="chevron-down">
                        <ChevronDown color='black'/>
                    </div>
                    <div className="chevron-down" style={{paddingLeft:'1.2em'}}>
                        <ChevronDown color='black'/>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{seconds[0]}</div>
                            <div className="back">{(parseInt(seconds[0]) + 1) % 10}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flipper">
                            <div className="front">{seconds[1]}</div>
                            <div className="back">{(parseInt(seconds[1]) + 1) % 10}</div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlipClock;
