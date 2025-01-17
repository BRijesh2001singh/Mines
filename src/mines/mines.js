import './mines.css';
import React, { useEffect, useRef, useState } from 'react';
import diamond from '../images/diamond.png';
import bomb from "../images/bomb.png"
import touch from "../audios/mixkit-instant-win-2021_XUqBT5bf.wav";
import explosion from "../audios/mixkit-arcade-game-explosion-2759.wav";
import jackpot from "../audios/mixkit-cheering-crowd-loud-whistle-610_MyeFrSLX.wav";
import titlebomb from "../images/titlebomb.webp"
const Mines = () => {
    const [grid, setGrid] = useState(9);
    const [blocks, setBlocks] = useState(Array(9).fill('hidden'));
    const [mine, setMine] = useState(Array(9).fill(0));
    const [gameover, setGameover] = useState(true);
    const [win, setWin] = useState(grid - 1);
    const [minenumber, setminenumber] = useState(1);
    const [score, setScore] = useState(0);
    const [showoverlay, setshowoverlay] = useState(true);
    const [highscore1, setHighscore1] = useState(localStorage.getItem("highscore1") || 0);
    const [highscore2, setHighscore2] = useState(localStorage.getItem("highscore2") || 0);
    const [highscore3, setHighscore3] = useState(localStorage.getItem("highscore3") || 0);


    //audio refs
    const clickaudioref = useRef(new Audio(touch));
    const explosionaudioref = useRef(new Audio(explosion));
    const jackpotaudioref = useRef(new Audio(jackpot));
    //Store Score locally
    useEffect(() => {
        localStorage.setItem('Highscore', JSON.stringify(score));
    }, [score]);
    function showHighscore() {
        if (grid === 9) return highscore1;
        if (grid === 25) return highscore2;
        if (grid === 49) return highscore3;
    }
    function showmines() {
        if (grid === 9) return 3;
        if (grid === 25) return 5;
        if (grid === 49) return 7;
    }
    const generatemines = (minenumber) => {
        mine.fill(0);
        const tempmine = Array(grid).fill(0);
        var mineplaced = 0;
        while (mineplaced < minenumber) {
            const mineindex = Math.floor(Math.random() * grid);
            if (tempmine[mineindex] === 0) {
                tempmine[mineindex] = 1;
                mineplaced++;
            }
        }
        setMine(tempmine);
    }


    const gameStart = () => {
        setGameover(false);
        setshowoverlay(false);
        setWin(grid - 1);
        setScore(0);

        //reset the board
        const newBlocks = [...blocks];
        newBlocks.fill("hidden");
        setBlocks(newBlocks);
        generatemines(minenumber);
    };


    //game over
    const handleclick = (index) => {
        if (gameover) return;
        if (blocks[index] === "visible") return;
        if (mine[index] === 1) {
            const tempblocks = [...blocks];
            tempblocks.fill("visible");
            setBlocks(tempblocks);
            setGameover(true);
            explosionaudioref.current.play();
            //showing and updating high score based on the grid size
            if (score > highscore1 && grid === 9) {
                localStorage.setItem("highscore1", score);
                setHighscore1(score);
            }
            if (score > highscore2 && grid === 25) {
                localStorage.setItem("highscore2", score);
                setHighscore2(score);
            }
            if (score > highscore3 && grid === 49) {
                localStorage.setItem("highscore3", score);
                setHighscore3(score);
            }

        }
        else {
            setWin((prevWin) => {
                const newWin = prevWin - 1;

                blocks[index] = "visible";
                setScore(score + 1);
                clickaudioref.current.play();
                if (newWin === 0) {
                    jackpotaudioref.current.play();
                    blocks[index] = "visible";
                    mine.forEach((item, ind) => {
                        if (item === 1) blocks[ind] = "visible";
                    })
                    setGameover(true);
                }
                return newWin;
            });
        }
    }
    //change grid size
    const changegrid = (gridsize, newminenumber) => {
        setGrid((gridsize));
        const newBlocks = Array(gridsize).fill("hidden");
        setBlocks(newBlocks);
        setminenumber(newminenumber);
        setGameover(true);
    }


    return (
        <div>
            <div className='navbar'>
                <div className='title'>
                    <img src={titlebomb} alt="diamond" style={{ width: '5vw', height: '70%', borderRadius: "5px" }} />
                    <h1>MINES</h1>
                </div>
                <div className='scores'>
                    <h3 >SCORE:{score}</h3>
                    <h3>Highscore:{showHighscore()}</h3>
                </div>
            </div>
            <div className='main-container'>
                <div className='sidebar'>
                    <div className='sidebar-content'>
                        <div className='game-info'
                        >
                            <div>Set Board</div>
                            <div>Number of mines : {showmines()}</div>
                        </div>
                        <div className='game-btns'>
                            <div className='set-board'>
                                <button className="grid-btn" onClick={() => changegrid(9, 1)}>3X3</button>
                                <button className="grid-btn" onClick={() => changegrid(25, 5)}>5X5</button>
                                <button className="grid-btn" onClick={() => changegrid(49, 7)}>7X7</button>
                            </div>
                            <div className='game-status'>
                                <button onClick={() => gameStart()}>Play</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container'>
                    {showoverlay && (
                        <div className='overlay'>
                            <div className='overlaytext'>Press Play button to start</div>
                        </div>
                    )}
                    <div
                        className='grid'
                        style={{
                            gridTemplateColumns: `repeat(${Math.sqrt(grid)}, 1fr)`,

                        }}
                    >
                        {blocks.map((value, index) => {
                            return (
                                <div
                                    key={index}
                                    className='blocks'
                                    onClick={() => handleclick(index)}

                                >
                                    <img src={mine[index] === 1 ? bomb : diamond} alt="diamond" style={{ width: '100%', height: '100%', objectFit: 'cover', visibility: blocks[index], borderRadius: "5px" }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Mines;
