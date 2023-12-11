import React, { useState, useEffect } from 'react';
import { ArrowRepeat, BrightnessHigh, BrightnessHighFill, ChevronDown, ChevronUp, Moon, MoonFill } from 'react-bootstrap-icons'
import '../Clock.css';
import dayjs from 'dayjs'

const FlipClock = ({ isVirtual, setIsVirtual, isAmPm, setIsAmPm, handleChageAmPm, settingVirtual, setSettingVirtual }) => {
    const [time, setTime] = useState(new Date());
    const [virtualTimeArray, setVirtualTimeArray] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [virtualTime, setVirtualTime] = useState();

    useEffect(() => {
        if (!isVirtual && !settingVirtual) {
            const interval = setInterval(() => {
                setTime(new Date());
            }, 1000);

            return () => clearInterval(interval);
        }
        if (settingVirtual) {
            let v = [];
            v.push(parseInt(month[0]))
            v.push(parseInt(month[1]))
            v.push(parseInt(day[0]))
            v.push(parseInt(day[1]))
            v.push(parseInt(year[0]))
            v.push(parseInt(year[1]))
            v.push(parseInt(year[2]))
            v.push(parseInt(year[3]))
            v.push(parseInt(hours[0]))
            v.push(parseInt(hours[1]))
            v.push(parseInt(minutes[0]))
            v.push(parseInt(minutes[1]))
            v.push(parseInt(seconds[0]))
            v.push(parseInt(seconds[1]))
            setVirtualTimeArray(v)
            console.log(v)
        }

        if (isVirtual) {
            const interval = setInterval(() => {
                setVirtualTime(prevVirtualTime => {
                    const updatedVirtualTime = prevVirtualTime.add(1, 'second');
                    return updatedVirtualTime;
                });
            }, 1000);
            return () => clearInterval(interval);
        }



    }, [isVirtual, settingVirtual]);

    const formatTime = (value) => {
        return value.toString().padStart(2, '0');
    };
    if (formatTime(time.getHours()) >= 12 && !isVirtual && !settingVirtual)
        setIsAmPm('pm')
    else if (formatTime(time.getHours()) < 12 && !isVirtual && !settingVirtual)
        setIsAmPm('am')


    let hours = !isVirtual ? formatTime(time.getHours() % 12 || 12) : formatTime(virtualTime.hour() % 12 || 12)
    let minutes = !isVirtual ? formatTime(time.getMinutes()) : formatTime(virtualTime.minute());
    let seconds = !isVirtual ? formatTime(time.getSeconds()) : formatTime(virtualTime.second())
    let day = !isVirtual ? time.getDate().toString().padStart(2, '0') : virtualTime.date().toString().padStart(2, '0')
    let month = !isVirtual ? (time.getMonth() + 1).toString().padStart(2, '0') : (virtualTime.month()+1).toString().padStart(2, '0')
    let year = !isVirtual ? time.getFullYear().toString() : virtualTime.year().toString().padStart(4, '0');
    if (isVirtual) {
        console.log('day', day)
    }


    const setVirtual = (v) => {
        let year = v.slice(4, 8).join('');
        let month = v.slice(0, 2).join('');
        let day = v.slice(2, 4).join('');
        let minutes = v.slice(10, 12).join('');
        let seconds = v.slice(12, 14).join('');


        let hours = v[8] * 10 + v[9]
        if (isAmPm === 'pm')
            hours += 12;
        let dateString = (`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`)
        console.log(dateString)
        let d = dayjs(new Date(dateString))
        console.log(d)
        setVirtualTime(d)
    }
    const handleChange = (id) => {
        console.log("Clicked ID:", id);
        let v = [...virtualTimeArray];
        let tmp;
        switch (id) {
            case 'm1_up':
                v[0] = parseInt((v[0] + 1) % 2)
                if (v[1] > 2)
                    v[1] = 0
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'm2_up':
                v[1] = parseInt((v[1] + 1) % 10)
                if (v[1] > 2)
                    v[0] = 0
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'd1_up':
                v[2] = parseInt((v[2] + 1) % 4)
                if (v[2] === 3 && v[3] > 1) {
                    v[3] = 0
                }
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'd2_up':
                tmp = parseInt((v[3] + 1) % 10)
                if (v[2] === 3) {
                    if (tmp < 2) {
                        v[3] = tmp
                        setVirtualTimeArray(v)
                        setVirtual(v)
                    }
                }
                else {
                    v[3] = tmp
                    setVirtualTimeArray(v)
                    setVirtual(v)
                }
                break;
            case 'y1_up':
                v[4] = parseInt((v[4] + 1) % 10)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'y2_up':
                v[5] = parseInt((v[5] + 1) % 10)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'y3_up':
                v[6] = parseInt((v[6] + 1) % 10)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'y4_up':
                v[7] = parseInt((v[7] + 1) % 10)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'h1_up':
                v[8] = parseInt((v[8] + 1) % 2)
                if (v[8] === 1) {
                    if (v[9] > 2)
                        v[9] = 0
                }

                setVirtualTimeArray(v)
                setVirtual(v)

                break;
            case 'h2_up':
                tmp = parseInt((v[9] + 1) % 10)
                if (v[8] === 1) {
                    if (tmp < 3) {
                        v[9] = tmp
                        setVirtualTimeArray(v)
                        setVirtual(v)
                    }
                    if (tmp > 2) {
                        v[9] = 0
                        setVirtualTimeArray(v)
                        setVirtual(v)
                    }
                }
                else {
                    v[9] = tmp
                    setVirtualTimeArray(v)
                    setVirtual(v)
                }
                break;
            case 'min1_up':
                v[10] = parseInt((v[10] + 1) % 6)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'min2_up':
                v[11] = parseInt((v[11] + 1) % 10)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 's1_up':
                v[12] = parseInt((v[12] + 1) % 6)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 's2_up':
                v[13] = parseInt((v[13] + 1) % 10)
                setVirtualTimeArray(v)
                setVirtual(v)
                break;

            case 'm1_down':
                tmp = parseInt((v[0] - 1) % 2)
                if (tmp < 0)
                    tmp = 1
                v[0] = tmp
                if (v[1] > 2)
                    v[1] = 0
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'm2_down':
                tmp = parseInt((v[1] - 1) % 10)
                if (tmp < 0)
                    tmp = 9
                v[1] = tmp
                if (v[1] > 2)
                    v[0] = 0
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'd1_down':

                tmp = parseInt((v[2] - 1) % 4)
                if (tmp < 0)
                    tmp = 3
                v[2] = tmp
                if (v[2] === 3 && v[3] > 1) {
                    v[3] = 0
                }
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'd2_down':
                tmp = parseInt((v[3] - 1) % 10)
                if (tmp < 0)
                    tmp = 9

                if (v[2] === 3) {
                    if (tmp < 2) {
                        v[3] = tmp
                    }
                    else {
                        v[3] = 0

                    }
                }
                else {
                    v[3] = tmp
                }
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'y1_down':
                tmp = parseInt((v[4] - 1) % 10)
                if (tmp < 0)
                    tmp = 9
                v[4] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'y2_down':
                tmp = parseInt((v[5] - 1) % 10)
                if (tmp < 0)
                    tmp = 9
                v[5] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'y3_down':
                tmp = parseInt((v[6] - 1) % 10)
                if (tmp < 0)
                    tmp = 9
                v[6] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'y4_down':
                tmp = parseInt((v[7] - 1) % 10)
                if (tmp < 0)
                    tmp = 9
                v[7] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;

            case 'h1_down':
                tmp = parseInt((v[8] - 1) % 2)
                if (tmp < 0)
                    tmp = 1
                v[8] = tmp

                if (v[8] === 1) {
                    if (v[9] > 2)
                        v[9] = 0
                }

                setVirtualTimeArray(v)
                setVirtual(v)

                break;
            case 'h2_down':
                tmp = parseInt((v[9] - 1) % 10)
                if (tmp < 0)
                    if (v[8] === 0)
                        tmp = 9
                    else
                        tmp = 2
                if (v[8] === 1) {
                    if (tmp < 3) {
                        v[9] = tmp
                    }
                    else {
                        v[9] = 0
                    }
                }
                else {
                    v[9] = tmp

                }
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'min1_down':
                tmp = parseInt((v[10] - 1) % 6)
                if (tmp < 0)
                    tmp = 5
                v[10] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 'min2_down':
                tmp = parseInt((v[11] - 1) % 10)
                if (tmp < 0)
                    tmp = 9
                v[11] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 's1_down':
                tmp = parseInt((v[12] - 1) % 6)
                if (tmp < 0)
                    tmp = 5
                v[12] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
            case 's2_down':
                tmp = parseInt((v[13] - 1) % 10)
                if (tmp < 0)
                    tmp = 9
                v[13] = tmp
                setVirtualTimeArray(v)
                setVirtual(v)
                break;
        }
    };

    return (
        <>
        <div className="flip-clock-container no-highlight">
            <div className="flip-clock no-highlight" style={{ paddingRight: '4em' }}>
                {/* Month 1 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('m1_up')}>
                        <ChevronUp color='black' id='m1_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[0] : month[0]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('m1_down')}>
                        <ChevronDown color='black' id='m1_down' />
                    </div>}
                </div>
                {/* Month 2 */}
                <div className="digit">
                   {settingVirtual && <div className="chevron-up" onClick={() => handleChange('m2_up')}>
                        <ChevronUp color='black' id='m2_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[1] : month[1]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('m2_down')}>
                        <ChevronDown color='black' id='m2_down' />
                    </div>}
                </div>
                <span className="date-separator"></span>
                {/* Day 1 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('d1_up')}>
                        <ChevronUp color='black' id='d1_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[2] : day[0]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('d1_down')}>
                        <ChevronDown color='black' id='d1_down' />
                    </div>}
                </div>
                {/* Day 2 */}
                <div className="digit">
                    {settingVirtual &&<div className="chevron-up" onClick={() => handleChange('d2_up')}>
                        <ChevronUp color='black' id='d2_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[3] : day[1]}</div>
                        </div>
                    </div>
                   {settingVirtual && <div className="chevron-down" onClick={() => handleChange('d2_down')}>
                        <ChevronDown color='black' id='d2_down' />
                    </div>}
                </div>
                <span className="date-separator"></span>
                {/* year 1 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('y1_up')}>
                        <ChevronUp color='black' id='y1_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[4] : year[0]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('y1_down')}>
                        <ChevronDown color='black' id='y1_down' />
                    </div>}
                </div>
                {/* year 2 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('y2_up')}>
                        <ChevronUp color='black' id='y2_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[5] : year[1]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('y2_down')}>
                        <ChevronDown color='black' id='y2_down' />
                    </div>}
                </div>
                {/* year 3 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('y3_up')}>
                        <ChevronUp color='black' id='y3_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[6] : year[2]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('y3_down')}>
                        <ChevronDown color='black' id='y3_down' />
                    </div>}
                </div>
                {/* year 4 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('y4_up')}>
                        <ChevronUp color='black' id='y4_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[7] : year[3]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('y4_down')}>
                        <ChevronDown color='black' id='y4_down' />
                    </div>}
                </div>
            </div>
            <span className="date-separator"></span>

            <div className="flip-clock">
                {/* Hour 1 */}
                <div className="digit">
                   {settingVirtual &&  <div className="chevron-up" onClick={() => handleChange('h1_up')}>
                        <ChevronUp color='black' id='h1_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[8] : hours[0]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('h1_down')}>
                        <ChevronDown color='black' id='h1_down' />
                    </div>}
                </div>
                {/* Hour 2 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('h2_up')}>
                        <ChevronUp color='black' id='h2_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[9] : hours[1]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('h2_down')}>
                        <ChevronDown color='black' id='h2_down' />
                    </div>}
                </div>
                <span className="date-separator"></span>

                {/* Minute 1 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('min1_up')}>
                        <ChevronUp color='black' id='min1_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[10] : minutes[0]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('min1_down')}>
                        <ChevronDown color='black' id='min1_down' />
                    </div>}
                </div>
                {/* Minute 2 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('min2_up')}>
                        <ChevronUp color='black' id='min2_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[11] : minutes[1]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('min2_down')}>
                        <ChevronDown color='black' id='min2_down' />
                    </div>}
                </div>
                <span className="date-separator"></span>

                {/* seconds 1 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('s1_up')}>
                        <ChevronUp color='black' id='s1_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[12] : seconds[0]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('s1_down')}>
                        <ChevronDown color='black' id='s1_down' />
                    </div>}
                </div>
                {/* Hour 2 */}
                <div className="digit">
                    {settingVirtual && <div className="chevron-up" onClick={() => handleChange('s2_up')}>
                        <ChevronUp color='black' id='s2_up' />
                    </div>}
                    <div className="card">
                        <div className="flipper">
                            <div className="front"> {settingVirtual ? virtualTimeArray[13] : seconds[1]}</div>
                        </div>
                    </div>
                    {settingVirtual && <div className="chevron-down" onClick={() => handleChange('s2_down')}>
                        <ChevronDown color='black' id='s2_down' />
                    </div>}
                </div>
            </div>
            {isAmPm == 'am' && <span style={{ fontFamily: 'LiquidCrystal' }} className='ampm'> AM </span>}
            {isAmPm == 'pm' && <span style={{ fontFamily: 'LiquidCrystal' }} className='ampm'> PM </span>}
            {settingVirtual && <ArrowRepeat className='search-button' onClick={handleChageAmPm} />}
        </div >
        </>
    );
};

export default FlipClock;
