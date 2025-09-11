const LoadingSpinner: React.FC = () => {
  return (
    <>
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#09A1A4]"></div>
      </div>
    </>
  );
};

export default LoadingSpinner;
