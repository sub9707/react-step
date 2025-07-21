import { LEVEL_CONFIG, SITE_CONFIG } from "../assets/data/UIData";
import Container from "../components/common/Container";
import MetaData from "../components/common/MetaData";
import LevelButton, { type levelDataProps } from "../components/MainPage/LevelButton";

const MainPage: React.FC = () => {
  return (
    <>
      <MetaData
        title={`${SITE_CONFIG.name} - 단계별 리액트 학습`}
        description={SITE_CONFIG.description}
        keywords="React, 리액트, 학습, 튜토리얼, 프로그래밍, 초급, 중급, 고급"
      />

      <Container className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-90px)]">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white">
            ReactJS Steps
          </h1>
          <p className="text-xl font-bold max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            초급부터 고급까지, 단계별로 리액트를 정복해보세요!
          </p>
          <p className="text-md max-w-2xl mt-3 mx-auto text-gray-600 dark:text-gray-300">
            본 과정은 ReactJS 19 버전으로 구성되었습니다
          </p>
        </div>

        {/* 레벨 선택 버튼*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {LEVEL_CONFIG.map((level: levelDataProps) => (
            <LevelButton {...level}/>
          ))}
        </div>
      </Container>
    </>
  );
};

export default MainPage;