import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  SkipForward,
  User,
  Code,
  Trophy,
  ChevronRight,
  Sparkles,
  Gamepad2,
  Zap,
  Target,
  Rocket,
} from 'lucide-react';

const Onboarding = ({ onReviewStart, reviewOther }) => {
  // 状态管理
  const [step, setStep] = useState(reviewOther ? 2 : 0);
  const [userName, setUserName] = useState('');
  const [level, setLevel] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [score, setScore] = useState(null);
  const [reason, setReason] = useState(null);

  // 动画状态
  const [showVideo, setShowVideo] = useState(reviewOther ? false : true);
  const [isVideoSkipped, setIsVideoSkipped] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const typingTimeoutRef = useRef(null);
  const optionsTimeoutRef = useRef(null);

  // NPC 对话脚本
  const dialogues = {
    1: `你好！我是你的复盘助手。${userName ? `很高兴见到你，${userName}！` : ''}勇士，怎么称呼你？`,
    2: reviewOther ? '好的，让我们继续复盘其他题目！这次是 GESP 几级？' : `收到，${userName}！这次我们挑战的是 GESP 几级？`,
    3: '这次考试有两道编程大题，你想先复盘哪一道？',
    4: '凭记忆，这道题你当时拿了多少分？',
    5: getStep5Dialogue(score),
    6: '档案建立完毕！正在启动编程复盘引擎...',
  };

  function getStep5Dialogue(currentScore) {
    if (currentScore === 25) {
      return '太强了！那我们来看看有没有更优解。';
    } else if (currentScore === 12.5) {
      return '是哪种情况导致没拿满分？';
    } else if (currentScore === 0) {
      return '遇到什么困难了？';
    }
    return '';
  }

  // 打字机效果
  useEffect(() => {
    if (step === 0) return; // 视频步骤不打字
    if (step === 1) return; // Step 1 单独处理

    const text = dialogues[step];
    setDisplayedText('');
    setIsTyping(true);
    setShowOptions(false);

    // 清除之前的定时器
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (optionsTimeoutRef.current) {
      clearTimeout(optionsTimeoutRef.current);
    }

    let index = 0;
    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 30); // 打字速度
      } else {
        setIsTyping(false);
        // 打字完成后 0.5 秒显示选项
        optionsTimeoutRef.current = setTimeout(() => {
          setShowOptions(true);
        }, 500);
      }
    };

    typeNextChar();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (optionsTimeoutRef.current) {
        clearTimeout(optionsTimeoutRef.current);
      }
    };
  }, [step, score, reviewOther]);

  // Step 1: 实时更新对话文本（不影响输入焦点）
  useEffect(() => {
    if (step === 1) {
      const step1Text = '你好！我是你的复盘助手。勇士，怎么称呼你？';
      setDisplayedText(step1Text);
      setIsTyping(false);
      setShowOptions(true);
    }
  }, [step]);

  // 视频结束处理
  const handleVideoEnd = () => {
    setShowVideo(false);
    setStep(1);
  };

  const handleSkipVideo = () => {
    setIsVideoSkipped(true);
    handleVideoEnd();
  };

  // 步骤处理函数
  const handleNameSubmit = () => {
    if (userName.trim()) {
      setStep(2);
    }
  };

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    setStep(3);
  };

  const handleQuestionSelect = (selectedQuestion) => {
    setQuestionId(selectedQuestion);
    setStep(4);
  };

  const handleScoreSelect = (selectedScore) => {
    setScore(selectedScore);
    setStep(5);
  };

  const handleReasonSelect = (selectedReason) => {
    setReason(selectedReason);
    setStep(6);
  };

  const handleStartReview = () => {
    onReviewStart?.({ userName, level, questionId, score, reason });
  };

  // 重置所有步骤
  useEffect(() => {
    if (step === 2) {
      setShowOptions(false);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker flex items-center justify-center p-4 overflow-hidden relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyber-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Step 0: 视频开场 */}
      {step === 0 && showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <div className="glass-panel p-8 relative overflow-hidden">
            {/* 视频占位符 */}
            <div className="aspect-video bg-cyber-dark rounded-xl flex items-center justify-center relative overflow-hidden border-2 border-cyber-primary/30">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20"></div>
              <div className="relative z-10 text-center">
                <Play className="w-20 h-20 text-cyber-primary mx-auto mb-4 animate-pulse" />
                <p className="text-xl text-gray-300">开场视频（20秒）</p>
                <p className="text-sm text-gray-500 mt-2">Video Placeholder</p>
              </div>
            </div>

            {/* 跳过按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkipVideo}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-cyber-dark/80 hover:bg-cyber-primary/20 border border-cyber-primary/50 rounded-lg transition-all duration-300 text-sm"
            >
              <SkipForward className="w-4 h-4" />
              跳过
            </motion.button>

            {/* 模拟视频结束 */}
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVideoEnd}
                className="cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary neon-text"
              >
                继续进入系统 <ChevronRight className="w-5 h-5 inline ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* RPG 对话界面 */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <div className="glass-panel p-8">
            {/* NPC 头像和对话区域 */}
            <div className="flex items-start gap-6 mb-8">
              {/* NPC 头像 */}
              <motion.div
                animate={isTyping ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3, repeat: isTyping ? Infinity : 0 }}
                className="flex-shrink-0"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary p-1 animate-float">
                  <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-cyber-primary" />
                  </div>
                </div>
                <div className="text-center mt-2 text-sm text-cyber-primary font-bold">AI 助教</div>
              </motion.div>

              {/* 对话气泡 */}
              <div className="flex-1">
                <div className="bg-cyber-dark/50 border-2 border-cyber-primary/30 rounded-2xl rounded-tl-none p-6 relative">
                  {displayedText && (
                    <p className="text-lg leading-relaxed">
                      {displayedText}
                      {isTyping && (
                        <span className="typewriter-cursor inline-block w-2 h-5 bg-cyber-primary ml-1 align-middle"></span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 用户选项区域 */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Step 1: 名字输入 */}
                  {step === 1 && (
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                        placeholder="输入你的名字..."
                        className="cyber-input flex-1"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNameSubmit}
                        disabled={!userName.trim()}
                        className="cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        确认 <ChevronRight className="w-5 h-5 inline ml-2" />
                      </motion.button>
                    </div>
                  )}

                  {/* Step 2: 等级选择 */}
                  {step === 2 && (
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                        <motion.button
                          key={lvl}
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLevelSelect(lvl)}
                          className={`cyber-button ${
                            level === lvl
                              ? 'bg-gradient-to-r from-cyber-primary to-cyber-secondary neon-text'
                              : 'bg-cyber-dark/80 border-2 border-cyber-primary/30 hover:border-cyber-primary'
                          }`}
                        >
                          {lvl}级
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step 3: 题目选择 */}
                  {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'A', label: '第一题：编程题 A', icon: Target },
                        { id: 'B', label: '第二题：编程题 B', icon: Target },
                      ].map((q) => (
                        <motion.button
                          key={q.id}
                          whileHover={{ scale: 1.03, y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleQuestionSelect(q.id)}
                          className={`cyber-button text-left ${
                            questionId === q.id
                              ? 'bg-gradient-to-r from-cyber-primary to-cyber-secondary neon-text'
                              : 'bg-cyber-dark/80 border-2 border-cyber-primary/30 hover:border-cyber-primary'
                          }`}
                        >
                          <q.icon className="w-5 h-5 inline mr-3" />
                          {q.label}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step 4: 分数选择 */}
                  {step === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 0, label: '没做/零分', emoji: '🔴', color: 'from-cyber-danger to-red-600', border: 'border-cyber-danger/50' },
                        { value: 12.5, label: '半对', emoji: '🟡', color: 'from-cyber-warning to-yellow-600', border: 'border-cyber-warning/50' },
                        { value: 25, label: '满分', emoji: '🟢', color: 'from-cyber-success to-green-600', border: 'border-cyber-success/50' },
                      ].map((s) => (
                        <motion.button
                          key={s.value}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleScoreSelect(s.value)}
                          className={`cyber-button ${
                            score === s.value
                              ? `bg-gradient-to-r ${s.color} neon-text`
                              : `bg-cyber-dark/80 border-2 ${s.border} hover:border-current`
                          } text-lg`}
                        >
                          <span className="text-2xl mr-2">{s.emoji}</span>
                          {s.label}
                          <span className="block text-sm opacity-80 mt-1">
                            {s.value} 分
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step 5: 原因选择（条件渲染） */}
                  {step === 5 && score === 25 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleReasonSelect('optimize')}
                        className="cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary neon-text text-xl px-12"
                      >
                        <Rocket className="w-6 h-6 inline mr-3" />
                        接受挑战
                      </motion.button>
                    </motion.div>
                  )}

                  {step === 5 && score === 12.5 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'TLE', label: '超时', icon: Zap },
                        { value: 'WA', label: '答案错误', icon: Target },
                        { value: 'incomplete', label: '部分没写完', icon: Code },
                        { value: 'unknown', label: '不清楚', icon: Gamepad2 },
                      ].map((r) => (
                        <motion.button
                          key={r.value}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReasonSelect(r.value)}
                          className={`cyber-button ${
                            reason === r.value
                              ? 'bg-gradient-to-r from-cyber-warning to-yellow-600 neon-text'
                              : 'bg-cyber-dark/80 border-2 border-cyber-warning/50 hover:border-cyber-warning'
                          }`}
                        >
                          <r.icon className="w-5 h-5 inline mr-2 mb-1" />
                          <div className="text-sm">{r.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {step === 5 && score === 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'not_understand', label: '题目没看懂', icon: Target },
                        { value: 'no_time', label: '没时间写', icon: Zap },
                        { value: 'syntax_error', label: '语法报错', icon: Code },
                        { value: 'no_idea', label: '没思路', icon: Gamepad2 },
                      ].map((r) => (
                        <motion.button
                          key={r.value}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReasonSelect(r.value)}
                          className={`cyber-button ${
                            reason === r.value
                              ? 'bg-gradient-to-r from-cyber-danger to-red-600 neon-text'
                              : 'bg-cyber-dark/80 border-2 border-cyber-danger/50 hover:border-cyber-danger'
                          }`}
                        >
                          <r.icon className="w-5 h-5 inline mr-2 mb-1" />
                          <div className="text-sm">{r.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step 6: 开始复盘 */}
                  {step === 6 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleStartReview}
                        className="cyber-button bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent neon-text text-2xl px-16 py-6 animate-glow"
                      >
                        <Rocket className="w-10 h-10 inline mr-4 mb-1" />
                        开始复盘
                      </motion.button>

                      {/* 用户信息摘要 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 p-4 bg-cyber-dark/30 rounded-lg border border-cyber-primary/20"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">选手</div>
                            <div className="text-cyber-primary font-bold">{userName}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">等级</div>
                            <div className="text-cyber-primary font-bold">{level} 级</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">题目</div>
                            <div className="text-cyber-primary font-bold">编程题 {questionId}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">得分</div>
                            <div className="text-cyber-primary font-bold">{score} 分</div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 进度指示器 */}
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <motion.div
                  key={s}
                  initial={false}
                  animate={{
                    scale: step === s ? 1.5 : 1,
                    backgroundColor: step >= s ? '#00f0ff' : '#1e293b',
                  }}
                  className="w-3 h-3 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Onboarding;
