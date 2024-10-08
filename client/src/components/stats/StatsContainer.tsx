import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStats } from "@/hooks";
import ErrorCard from "../primitive/ErrorCard";
import { cn } from "@/lib/utils";
import WordRotate from "../magicui/word-rotate";
import StatCard from "./_partials/StatCard";
import StatsFriendshipEndpointsDialog from "./_partials/StatsFriendshipEndpointsDialog";
import StatsLoadingSkeleton from "./_partials/StatsLoadingSkeleton";
import StatsUsersEndpointsDialog from "./_partials/StatsUsersEndpointsDialog";

//
import DogePink from "@/assets/backgrounds/doge-pink.jpg";
import DogeStanding from "@/assets/backgrounds/doge-standing.jpg";
import DogeTrio from "@/assets/backgrounds/doge-trio.jpg";

//#region Dialogs

//#endregion Dialogs

//#region Helper components
const STATS_HEIGHT_CLASS = "h-64";
const STATS_GAP_CLASS = "gap-6";

//#endregion Helper components

//#region Stats Container
function StatsContainer() {
	const { statsQuery } = useStats();
	const {
		data: stats,
		isLoading: statsAreLoading,
		isError: statsHaveError,
		error,
		isPending: statsArePending,
		isSuccess: statsSuccessfullyLoaded,
	} = statsQuery;

	const [userStatsDialogIsOpen, _setUserStatsDialogIsOpen] = useState(false);
	const [friendshipStatsDialogIsOpen, _setFriendshipStatsDialogIsOpen] =
		useState(false);

	return (
		<>
			{statsSuccessfullyLoaded && (
				<>
					<StatsUsersEndpointsDialog
						open={userStatsDialogIsOpen}
						userStats={stats.users}
						setOpen={_setUserStatsDialogIsOpen}
					/>
					<StatsFriendshipEndpointsDialog
						open={friendshipStatsDialogIsOpen}
						friendshipStats={stats.friendships}
						setOpen={_setFriendshipStatsDialogIsOpen}
					/>
				</>
			)}

			<Card className="mb-12">
				<CardHeader>
					<WordRotate
						className="text-4xl font-bold text-black dark:text-white"
						words={["Stats", "Insights", "Analytics"]}
					/>
					<p className="mt-4 text-lg font-light text-slate-700/80">
						Click on any card to see the endpoints responsible for them 😁
					</p>
				</CardHeader>
				<CardContent>
					{
						// Handle loading
						(statsAreLoading || statsArePending) && (
							<StatsLoadingSkeleton
								className={cn(STATS_HEIGHT_CLASS, STATS_GAP_CLASS)}
							/>
						)
					}
					{
						// Handle errors
						statsHaveError && <ErrorCard error={error} />
					}
					{
						// Display stats
						statsSuccessfullyLoaded && (
							<div
								className={cn(
									"grid grid-cols-1 md:grid-cols-3",
									STATS_GAP_CLASS
								)}
							>
								<StatCard
									className={STATS_HEIGHT_CLASS}
									title="Total users"
									value={stats.users.total}
									imgUrl={DogePink}
									onClick={() => _setUserStatsDialogIsOpen(true)}
								/>
								<StatCard
									className={STATS_HEIGHT_CLASS}
									title="Average friends per user"
									value={stats.friendships.averageFriendshipsPerUser}
									imgUrl={DogeStanding}
									onClick={() => _setFriendshipStatsDialogIsOpen(true)}
								/>
								<StatCard
									className={STATS_HEIGHT_CLASS}
									title="Total friendships"
									value={stats.friendships.total}
									imgUrl={DogeTrio}
									onClick={() => _setFriendshipStatsDialogIsOpen(true)}
								/>
							</div>
						)
					}
				</CardContent>
			</Card>
		</>
	);
}

export default StatsContainer;
