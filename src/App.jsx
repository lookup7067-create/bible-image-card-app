import React, { useState, useRef, useEffect } from 'react'
import { Download, Share2, Image as ImageIcon, MessageSquare, BookOpen, RefreshCw, Type } from 'lucide-react'
import html2canvas from 'html2canvas'
import { motion, AnimatePresence } from 'framer-motion'
import localVerses from './data/verses.json'

const BIBLE_BOOKS = {
  "창세기": "Genesis", "출애굽기": "Exodus", "레위기": "Leviticus", "민수기": "Numbers", "신명기": "Deuteronomy",
  "여호수아": "Joshua", "사사기": "Judges", "루스기": "Ruth", "사무엘상": "1Samuel", "사무엘하": "2Samuel",
  "열왕기상": "1Kings", "열왕기하": "2Kings", "역대상": "1Chronicles", "역대하": "2Chronicles", "에스라": "Ezra",
  "느헤미야": "Nehemiah", "에스더": "Esther", "욥기": "Job", "시편": "Psalms", "잠언": "Proverbs",
  "전도서": "Ecclesiastes", "아가": "SongofSongs", "이사야": "Isaiah", "예레미야": "Jeremiah", "예레미야애가": "Lamentations",
  "에스겔": "Ezekiel", "다니엘": "Daniel", "호세아": "Hosea", "요엘": "Joel", "아모스": "Amos",
  "오바댜": "Obadiah", "요나": "Jonah", "미가": "Micah", "나훔": "Nahum", "하박국": "Habakkuk",
  "스바냐": "Zephaniah", "학개": "Haggai", "스가랴": "Zechariah", "말라기": "Malachi",
  "마태복음": "Matthew", "마가복음": "Mark", "누가복음": "Luke", "요한복음": "John", "사도행전": "Acts",
  "로마서": "Romans", "고린도전서": "1Corinthians", "고린도후서": "2Corinthians", "갈라디아서": "Galatians", "에베소서": "Ephesians",
  "빌립보서": "Philippians", "골로새서": "Colossians", "데살로니가전서": "1 Thessalonians", "데살로니가후서": "2 Thessalonians", "디모데전서": "1 Timothy",
  "디모데후서": "2 Timothy", "디도서": "Titus", "빌레몬서": "Philemon", "히브리서": "Hebrews", "야고보서": "James",
  "베드로전서": "1 Peter", "베드로후서": "2 Peter", "요한1서": "1 John", "요한2서": "2 John", "요한3서": "3 John",
  "유다서": "Jude", "요한계시록": "Revelation"
}

const BIBLE_NUM_IDS = {
  "창세기": 1, "출애굽기": 2, "레위기": 3, "민수기": 4, "신명기": 5,
  "여호수아": 6, "사사기": 7, "루스기": 8, "사무엘상": 9, "사무엘하": 10,
  "열왕기상": 11, "열왕기하": 12, "역대상": 13, "역대하": 14, "에스라": 15,
  "느헤미야": 16, "에스더": 17, "욥기": 18, "시편": 19, "잠언": 20,
  "전도서": 21, "아가": 22, "이사야": 23, "예레미야": 24, "예레미야애가": 25,
  "에스겔": 26, "다니엘": 27, "호세아": 28, "요엘": 29, "아모스": 30,
  "오바댜": 31, "요나": 32, "미가": 33, "나훔": 34, "하박국": 35,
  "스바냐": 36, "학개": 37, "스가랴": 38, "말라기": 39,
  "마태복음": 40, "마가복음": 41, "누가복음": 42, "요한복음": 43, "사도행전": 44,
  "로마서": 45, "고린도전서": 46, "고린도후서": 47, "갈라디아서": 48, "에베소서": 49,
  "빌립보서": 50, "골로새서": 51, "데살로니가전서": 52, "데살로니가후서": 53, "디모데전서": 54,
  "디모데후서": 55, "디도서": 56, "빌레몬서": 57, "히브리서": 58, "야고보서": 59,
  "베드로전서": 60, "베드로후서": 61, "요한1서": 62, "요한2서": 63, "요한3서": 64,
  "유다서": 65, "요한계시록": 66
};

// Shortcut mapping
const BOOK_SHORTCUTS = {
  "창": "창세기", "출": "출애굽기", "레": "레위기", "민": "민수기", "신": "신명기",
  "수": "여호수아", "삿": "사사기", "룻": "루스기", "삼상": "사무엘상", "삼하": "사무엘하",
  "왕상": "열왕기상", "왕하": "열왕기하", "대상": "역대상", "대하": "역대하", "스": "에스라",
  "느": "느헤미야", "에": "에스더", "욥": "욥기", "시": "시편", "잠": "잠언",
  "전": "전도서", "아": "아가", "사": "이사야", "렘": "예레미야", "애": "예레미야애가",
  "겔": "에스겔", "단": "다니엘", "호": "호세아", "욜": "요엘", "암": "아모스",
  "옵": "오바댜", "욘": "요나", "미": "미가", "나": "나훔", "합": "하박국",
  "습": "스바냐", "학": "학개", "슥": "스가랴", "말": "말라기",
  "마": "마태복음", "막": "마가복음", "눅": "누가복음", "요": "요한복음", "행": "사도행전",
  "롬": "로마서", "고전": "고린도전서", "고후": "고린도후서", "갈": "갈라디아서", "엡": "에베소서",
  "빌": "빌립보서", "골": "골로새서", "살전": "데살로니가전서", "살후": "데살로니가후서", "딤전": "디모데전서",
  "딤후": "디모데후서", "딛": "디도서", "몬": "빌레몬서", "히": "히브리서", "약": "야고보서",
  "벧전": "베드로전서", "벧후": "베드로후서", "요일": "요한1서", "요이": "요한2서", "요삼": "요한3서",
  "유": "유다서", "계": "요한계시록"
}

function App() {
  const [activeTab, setActiveTab] = useState('verse')
  const [verseText, setVerseText] = useState('태초에 하나님이 천지를 창조하시니라')
  const [verseRef, setVerseRef] = useState('창세기 1:1')
  const [customMessage, setCustomMessage] = useState('오늘도 주님 안에서 승리하세요!')
  const [selectedBg, setSelectedBg] = useState('/backgrounds/forest.png')
  const [verseInput, setVerseInput] = useState('창세기 1:1')
  const [isLoading, setIsLoading] = useState(false)
  const [errorPrompt, setErrorPrompt] = useState('')
  const [fontSize, setFontSize] = useState(1.8) // in rem

  const cardRef = useRef(null)

  // Dynamic font size adjustment based on text length
  useEffect(() => {
    const len = verseText.length
    if (len > 100) setFontSize(1.2)
    else if (len > 60) setFontSize(1.4)
    else if (len > 30) setFontSize(1.6)
    else setFontSize(1.8)
  }, [verseText])

  // Wrap autoFetchVerse with useCallback to avoid unnecessary re-renders
  const autoFetchVerse = React.useCallback(async (match, force = false) => {
    let book = match[1];
    const chapter = match[2];
    const verse = match[3];

    if (BOOK_SHORTCUTS[book]) book = BOOK_SHORTCUTS[book];
    const fullRef = `${book} ${chapter}:${verse}`;

    // Skip if already loaded unless forced
    if (!force && verseRef === fullRef) return;

    setIsLoading(true);
    setErrorPrompt('');

    try {
      // 1. Local Fallback check (Very robust matching)
      const found = localVerses.find(v => {
        const cleanRef = v.ref.replace(/\s/g, '');
        const targetRef = fullRef.replace(/\s/g, '');
        return cleanRef === targetRef || (v.ref.includes(book) && v.ref.includes(`${chapter}:${verse}`));
      });

      if (found) {
        setVerseText(found.text);
        setVerseRef(found.ref);
        setIsLoading(false);
        return;
      }

      // 2. API Fetch (Using Multiple Sources)
      const bookId = BIBLE_NUM_IDS[book];
      if (!bookId) {
        if (force) setErrorPrompt("성경 책 이름을 정확히 인식하지 못했습니다.");
        return;
      }

      setErrorPrompt("서버에서 말씀을 찾는 중입니다...");

      // Expanded variations with better translation codes
      const variations = [
        // Primary: Bolls Life API (Extremely reliable for specific verses)
        `https://bolls.life/get-verse/KRV/${bookId}/${chapter}/${verse}/`,
        // Fallback A: Manana API (Standard KR)
        `https://api.manana.kr/bible/text/ko_rev/${bookId}/${chapter}/${verse}.json`,
        // Fallback B: Manana API (Alternative tag)
        `https://api.manana.kr/bible/text/개역개정/${bookId}/${chapter}/${verse}.json`
      ];

      for (const url of variations) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();

            // Handle different JSON structures
            let text = "";
            if (Array.isArray(data) && data.length > 0) {
              text = data[0].text;
            } else if (data && data.text) {
              text = data.text;
            }

            if (text) {
              setVerseText(text.replace(/<[^>]*>/g, '').trim());
              setVerseRef(fullRef);
              setErrorPrompt(""); // Clear message on success
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error(`Failed to fetch from ${url}:`, e);
        }
      }

      if (force) setErrorPrompt("말씀을 찾을 수 없습니다. (데이터베이스에 없거나 서버가 불안정합니다)");
    } catch (err) {
      console.warn("Auto fetch attempt failed:", err);
      if (force) setErrorPrompt("서버 연결에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [verseRef]);

  // Automatic verse fetching with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Improved regex: splits book name from chapter even without spaces (e.g., "시편23:4")
      const match = verseInput.trim().match(/^([가-힣\d]*[가-힣])\s*(\d+)[^가-힣\d]+(\d+)$/);
      if (match) {
        autoFetchVerse(match);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [verseInput, autoFetchVerse]);

  const fetchVerse = async () => {
    const match = verseInput.trim().match(/^([가-힣\d]*[가-힣])\s*(\d+)[^가-힣\d]+(\d+)$/);
    if (!match) {
      setErrorPrompt("형식이 올바르지 않습니다 (예: 창세기 1:1)");
      return;
    }
    await autoFetchVerse(match, true); // Use force=true for manual click
  };

  const downloadCard = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 3, // Even higher quality for sharing
    })
    return canvas.toDataURL('image/png')
  };

  const handleDownload = async () => {
    const dataUrl = await downloadCard();
    const link = document.createElement('a')
    link.download = `bible-card-${verseRef}.png`
    link.href = dataUrl
    link.click()
  }

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      setIsLoading(true);
      setErrorPrompt("공유용 이미지를 준비하는 중입니다...");

      const dataUrl = await downloadCard();

      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `bible-card-${Date.now()}.png`, { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: '은혜로운 말씀 카드',
            text: `[${verseRef}] ${verseText}`,
          });
          setErrorPrompt("");
          setIsLoading(false);
          return;
        }
      }

      // Fallback: If sharing is not supported (PC, HTTP, etc.)
      handleDownload();
      setErrorPrompt("이미지를 저장했습니다! 카톡에서 전송해 주세요.");
      alert("현재 환경에서는 직접 공유를 지원하지 않아 이미지를 자동 저장했습니다.\n\n카카오톡을 열고 방금 저장된 이미지를 친구에게 전송해주세요! 🙏");
    } catch (err) {
      console.error("Share failed:", err);
      handleDownload();
      setErrorPrompt("공유 중 오류가 발생하여 이미지를 저장했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (readerEvent) => {
        setSelectedBg(readerEvent.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="app-container">
      <header className="title-section">
        <h1>말씀 카드 메이커</h1>
      </header>

      {/* Card Preview Area */}
      <motion.div
        className="card-preview-wrapper"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-preview" ref={cardRef}>
          <img src={selectedBg} alt="background" className="card-bg" />
          <div className="card-overlay" />
          <div className="card-content">
            <div className="verse-container shadow-text">
              <p className="verse-text" style={{ fontSize: `${fontSize}rem` }}>
                "{verseText}"
              </p>
              <p className="verse-ref">({verseRef})</p>
            </div>
            {customMessage && (
              <p className="custom-message">
                {customMessage}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Control Panel */}
      <div className="controls-container">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'verse' ? 'active' : ''}`}
            onClick={() => setActiveTab('verse')}
          >
            <BookOpen size={18} />
            말씀
          </button>
          <button
            className={`tab-btn ${activeTab === 'bg' ? 'active' : ''}`}
            onClick={() => setActiveTab('bg')}
          >
            <ImageIcon size={18} />
            배경
          </button>
          <button
            className={`tab-btn ${activeTab === 'msg' ? 'active' : ''}`}
            onClick={() => setActiveTab('msg')}
          >
            <MessageSquare size={18} />
            메시지
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'verse' && (
            <motion.div
              key="verse"
              className="control-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="input-group">
                <label>성경 장/절 입력</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={verseInput}
                    onChange={(e) => setVerseInput(e.target.value)}
                    placeholder="예: 창세기 1:1"
                    style={{ flex: 1 }}
                  />
                  <button className="btn-primary" onClick={fetchVerse} disabled={isLoading} style={{ flex: 'none', padding: '0 1rem', width: 'auto' }}>
                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : '찾기'}
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: errorPrompt ? '#ff6b6b' : 'var(--text-secondary)', marginTop: '0.4rem', minHeight: '1rem' }}>
                  {isLoading ? '📖 말씀을 불러오는 중...' : (errorPrompt || '형식: "창세기 1:1" 또는 "창 1:1"')}
                </p>
              </div>
              <div className="input-group">
                <label>직접 편집</label>
                <textarea
                  rows="3"
                  value={verseText}
                  onChange={(e) => setVerseText(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'bg' && (
            <motion.div
              key="bg"
              className="control-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-grid">
                {['/backgrounds/forest.png', '/backgrounds/sunlight.png', '/backgrounds/character.png'].map((bg) => (
                  <div
                    key={bg}
                    className={`bg-item ${selectedBg === bg ? 'selected' : ''}`}
                    onClick={() => setSelectedBg(bg)}
                  >
                    <img src={bg} alt="theme" />
                  </div>
                ))}
                <label className="bg-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  <ImageIcon size={24} />
                  <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'msg' && (
            <motion.div
              key="msg"
              className="control-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="input-group">
                <label>축복의 메시지 (최대 25자)</label>
                <input
                  type="text"
                  maxLength={25}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="사랑하는 이에게 전할 말을 적어주세요"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="action-buttons">
          <button className="btn-primary" onClick={handleDownload}>
            <Download size={20} />
            이미지 저장
          </button>
          <button className="btn-secondary" onClick={handleShare}>
            <Share2 size={20} />
            공유하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
