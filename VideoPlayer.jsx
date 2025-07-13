// Video player component
function VideoPlayer({ video }) {
    return (
        <div className="w-full">
            <video 
                className="w-full h-[350px] rounded-lg object-cover" 
                src={video.videoUrl} 
                controls 
                autoPlay 
            />
        </div>
    );
}

export default VideoPlayer;