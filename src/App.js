import React from "react";
import {useQuery} from "@tanstack/react-query";
import {Container} from "@mui/material";
import Grid from '@mui/material/Grid2';
import NewsTicker, {Directions} from "react-advanced-news-ticker";
import {useSearchParams} from "react-router-dom";

const App = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const appId = searchParams.get('appId');
    const apiKey = searchParams.get('apiKey');
    const steamId = searchParams.get('steamId');

    const {isPending, error, data, isFetching, isFetched} = useQuery({
        queryKey: ['repoData'],
        queryFn: async () => {
            const response = await fetch(
                `ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${apiKey}&steamid=${steamId}&l=english`,
            )
            return await response.json()
        },
    });


    const renderAchievements = () => {
        if (isPending) return <p>Loading...</p>
        if (error) return <p>Error: {error.message}</p>
        if (isFetched) {
            const achievements = {locked: [], unlocked: []};
            data.playerstats.achievements.forEach(achievement => {

                if (achievement.achieved) {
                    achievements.unlocked.push(achievement);
                } else {
                    achievements.locked.push(achievement);
                }
            });
            const sortedAchievements = {
                unlocked: achievements.unlocked.sort((a, b) => b.unlocktime - a.unlocktime).slice(0, 5),
                locked: achievements.locked
            };

            return (
                <Grid container={true} spacing={1}>
                    <Grid size={12}>
                        <NewsTicker rowHeight={64} maxRows={1} duration={10000} speed={2000} direction={Directions.DOWN}
                                    style={{listStyle: 'none', padding: 0, margin: 0, width: '100%', backgroundColor: '#262626'}}>
                            {sortedAchievements.unlocked.map((achievement, index) => {
                                const unlockDate = new Date(achievement.unlocktime * 1000);
                                return (
                                    <Grid container={true} spacing={2} key={achievement.apiname}>
                                        <Grid size={12} sx={{
                                            maxHeight: 24,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {achievement.name}
                                        </Grid>
                                        <Grid size={"grow"} sx={{
                                            maxHeight: 24,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {achievement.description}
                                        </Grid>
                                        <Grid size={"auto"} sx={{
                                            maxHeight: 24,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {unlockDate.toLocaleDateString()}
                                        </Grid>
                                    </Grid>
                                    // <ListItemText
                                    //     key={achievement.apiname}
                                    //     primary={achievement.name}
                                    //     secondary={
                                    //         <Grid container={true} columns={12} spacing={2}>
                                    //             <Grid size={9}>{achievement.description}</Grid>
                                    //             <Grid size={3}>{unlockDate.toLocaleDateString()}</Grid>
                                    //         </Grid>
                                    //     }
                                    // />
                                );
                            })}
                        </NewsTicker>
                    </Grid>

                    <Grid size={12}>
                        <NewsTicker rowHeight={64} maxRows={1} duration={1000} speed={2000} direction={Directions.DOWN}
                                    style={{listStyle: 'none', padding: 0, margin: 0, width: '100%', backgroundColor: '#262626'}}>
                            {sortedAchievements.locked.map((achievement, index) => {
                                return (
                                    <Grid container={true} spacing={2} key={achievement.apiname}>
                                        <Grid size={12} sx={{
                                            maxHeight: 24,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {achievement.name}
                                        </Grid>
                                        <Grid size={"grow"} sx={{
                                            maxHeight: 24,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {achievement.description}
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </NewsTicker>
                    </Grid>
                </Grid>
            )
        }
    }

    return (
        <Container disableGutters={true}>
            {renderAchievements()}
        </Container>
    );
}

export default App;
