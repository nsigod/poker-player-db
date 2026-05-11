#!/usr/bin/env python3
"""
数据迁移脚本：从 src/data/database.ts 的 TypeScript 数据导入到 MySQL
运行方式：cd poker-player-db && python backend/data_migration.py

前置条件：
1. MySQL 已运行并创建了数据库 poker_player_db
2. 已安装 requirements.txt 依赖
3. 已创建 .env 文件配置数据库连接
"""
import re
import json
import sys
import os

# 解析 database.ts 中的数据
def parse_database_ts(filepath: str) -> dict:
    """从 database.ts 文件中解析出 PLAYERS, TOURNAMENTS, INITIAL_VIDEOS 数据"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    result = {}

    # 解析 PLAYERS 数组
    players_match = re.search(
        r'export const PLAYERS: Player\[\] = \[(.*?)\n\];',
        content, re.DOTALL
    )
    if players_match:
        result["PLAYERS"] = parse_typed_array(players_match.group(1), "player")

    # 解析 TOURNAMENTS 数组
    tournaments_match = re.search(
        r'export const TOURNAMENTS: Tournament\[\] = \[(.*?)\n\];',
        content, re.DOTALL
    )
    if tournaments_match:
        result["TOURNAMENTS"] = parse_typed_array(tournaments_match.group(1), "tournament")

    # 解析 INITIAL_VIDEOS 数组
    videos_match = re.search(
        r'export const INITIAL_VIDEOS: Video\[\] = \[(.*?)\n\];',
        content, re.DOTALL
    )
    if videos_match:
        result["INITIAL_VIDEOS"] = parse_typed_array(videos_match.group(1), "video")

    return result


def parse_typed_array(content: str, array_type: str) -> list:
    """解析 TypeScript 对象数组为 Python 字典列表"""
    # 用正则切分出每个对象块
    # 每个 { ... } 是一个对象
    objects = []
    depth = 0
    start = -1

    for i, ch in enumerate(content):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start >= 0:
                obj_str = content[start:i+1]
                try:
                    obj = parse_ts_object(obj_str, array_type)
                    objects.append(obj)
                except Exception as e:
                    print(f"  [WARN] 解析失败: {e}\n  片段: {obj_str[:100]}...")
                start = -1

    return objects


def parse_ts_object(obj_str: str, obj_type: str) -> dict:
    """将 TypeScript 对象字符串转换为 Python 字典"""
    # 去掉首尾的 {}
    obj_str = obj_str.strip()[1:-1].strip()

    result = {}
    i = 0

    while i < len(obj_str):
        # 跳过空白和逗号
        while i < len(obj_str) and obj_str[i] in ' \t\n,':
            i += 1
        if i >= len(obj_str):
            break

        # 读取 key
        key_start = i
        if obj_str[i] == '"':
            # 双引号 key
            i += 1
            while i < len(obj_str) and obj_str[i] != '"':
                if obj_str[i] == '\\':
                    i += 1  # skip escape
                i += 1
            key = obj_str[key_start+1:i]
            i += 1  # skip closing "
        elif obj_str[i] == "'":
            # 单引号 key
            i += 1
            while i < len(obj_str) and obj_str[i] != "'":
                i += 1
            key = obj_str[key_start+1:i]
            i += 1
        else:
            # 无引号 key
            while i < len(obj_str) and obj_str[i] not in ': \t\n,':
                i += 1
            key = obj_str[key_start:i].strip()

        # 跳过 : 和空白
        while i < len(obj_str) and obj_str[i] in ': \t\n':
            i += 1

        if i >= len(obj_str):
            break

        # 读取 value
        if obj_str[i] == '[':
            # 数组
            arr_end = find_matching_bracket(obj_str, i, '[', ']')
            arr_str = obj_str[i+1:arr_end].strip()
            if arr_str:
                result[key] = parse_array_value(arr_str, key, obj_type)
            else:
                result[key] = []
            i = arr_end + 1
        elif obj_str[i] == '{':
            # 嵌套对象
            obj_end = find_matching_bracket(obj_str, i, '{', '}')
            result[key] = parse_ts_object(obj_str[i:obj_end+1], obj_type)
            i = obj_end + 1
        elif obj_str[i] in '"\'':
            # 字符串
            quote = obj_str[i]
            i += 1
            val_start = i
            while i < len(obj_str) and obj_str[i] != quote:
                if obj_str[i] == '\\':
                    i += 1
                i += 1
            value = obj_str[val_start:i]
            # 处理转义字符
            value = value.replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"').replace("\\'", "'")
            result[key] = value
            i += 1
        elif obj_str[i:i+4] == 'true':
            result[key] = True
            i += 4
        elif obj_str[i:i+5] == 'false':
            result[key] = False
            i += 5
        elif obj_str[i:i+4] == 'null' or obj_str[i:i+9] == 'undefined':
            result[key] = None
            i += 4 if obj_str[i:i+4] == 'null' else 9
        else:
            # 数字
            num_start = i
            while i < len(obj_str) and obj_str[i] not in ', \t\n}':
                i += 1
            num_str = obj_str[num_start:i].strip()
            try:
                result[key] = int(num_str)
            except ValueError:
                try:
                    result[key] = float(num_str)
                except ValueError:
                    result[key] = num_str

    return result


def parse_array_value(arr_str: str, key: str, parent_type: str) -> list:
    """解析数组值"""
    # 根据上下文判断数组内容类型
    if key in ('tags', 'otherSeries'):
        # 字符串数组
        return parse_string_array(arr_str)
    elif key == 'tritonResults' or key == 'results':
        # 对象数组
        return parse_typed_array("[" + arr_str + "]", key.replace('tritonR', 'player_r'))
    elif key == 'players':
        # 字符串数组（视频的 players）
        return parse_string_array(arr_str)
    elif key == 'eventList':
        # 对象数组（赛事子事件）
        return parse_typed_array("[" + arr_str + "]", "tournament_event")
    else:
        return parse_string_array(arr_str)


def parse_string_array(arr_str: str) -> list:
    """解析字符串数组"""
    items = []
    i = 0
    arr_str = arr_str.strip()

    while i < len(arr_str):
        while i < len(arr_str) and arr_str[i] in ' \t\n,':
            i += 1
        if i >= len(arr_str):
            break

        if arr_str[i] in '"\'':
            quote = arr_str[i]
            i += 1
            val_start = i
            while i < len(arr_str) and arr_str[i] != quote:
                if arr_str[i] == '\\':
                    i += 1
                i += 1
            items.append(arr_str[val_start:i])
            i += 1
        else:
            val_start = i
            while i < len(arr_str) and arr_str[i] not in ',\n':
                i += 1
            val = arr_str[val_start:i].strip()
            if val:
                items.append(val)

    return items


def find_matching_bracket(s: str, start: int, open_ch: str, close_ch: str) -> int:
    """找到匹配的括号位置"""
    depth = 0
    in_string = None
    for i in range(start, len(s)):
        ch = s[i]
        if in_string:
            if ch == '\\':
                continue
            if ch == in_string:
                in_string = None
            continue
        if ch in '"\'':
            in_string = ch
            continue
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return i
    return len(s) - 1


def import_to_mysql(data: dict, db_url: str):
    """将解析的数据导入 MySQL"""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from models import Base, Player, PlayerResult, Tournament, TournamentEvent, TournamentEventResult, Video

    engine = create_engine(db_url, echo=False)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 1. 导入选手
        players_data = data.get("PLAYERS", [])
        print(f"\n导入选手: {len(players_data)} 条")

        player_slug_to_id = {}
        for i, p in enumerate(players_data):
            player = Player(
                slug=p.get("id", f"player-{i}"),
                name=p.get("name", ""),
                country=p.get("country"),
                flag=p.get("flag"),
                nickname=p.get("nickname"),
                image=p.get("image"),
                total_earnings=p.get("totalEarnings"),
                titles=p.get("titles", 0),
                cashes=p.get("cashes", 0),
                best_cash=p.get("bestCash"),
                bio=p.get("bio", ""),
                tags=p.get("tags", []),
                other_series=p.get("otherSeries", []),
            )
            session.add(player)
            session.flush()  # 获取 ID
            player_slug_to_id[player.slug] = player.id

            # 导入比赛记录
            results = p.get("tritonResults", [])
            for r in results:
                result = PlayerResult(
                    player_id=player.id,
                    year=r.get("year"),
                    location=r.get("location"),
                    event_name=r.get("eventName"),
                    buy_in=r.get("buyIn"),
                    prize=r.get("prize"),
                    placing=r.get("placing"),
                    players_count=r.get("players"),
                )
                session.add(result)

            if (i + 1) % 100 == 0:
                session.commit()
                print(f"  已导入 {i+1}/{len(players_data)} 选手")

        session.commit()
        print(f"  选手导入完成: {len(players_data)} 条")

        # 2. 导入赛事
        tournaments_data = data.get("TOURNAMENTS", [])
        print(f"\n导入赛事: {len(tournaments_data)} 条")

        for i, t in enumerate(tournaments_data):
            tournament = Tournament(
                name=t.get("name"),
                year=t.get("year"),
                location=t.get("location"),
                start_date=t.get("startDate"),
                end_date=t.get("endDate"),
                events_count=t.get("events"),
                total_prize_pool=t.get("totalPrizePool"),
                winner=t.get("winner"),
                image_url=t.get("imageUrl"),
                description=t.get("description", ""),
            )
            session.add(tournament)
            session.flush()

            # 导入子事件
            events = t.get("eventList", [])
            for e in events:
                event = TournamentEvent(
                    tournament_id=tournament.id,
                    name=e.get("name"),
                    game_type=e.get("gameType"),
                    buy_in=e.get("buyIn"),
                    entries=e.get("entries"),
                    prize_pool=e.get("prizePool"),
                    date=e.get("date"),
                    status=e.get("status"),
                )
                session.add(event)
                session.flush()

                # 导入子事件结果
                results = e.get("results", [])
                for r in results:
                    player_slug = r.get("playerId")
                    player_db_id = player_slug_to_id.get(player_slug) if player_slug else None

                    result = TournamentEventResult(
                        event_id=event.id,
                        placing=r.get("placing"),
                        player_name=r.get("playerName"),
                        player_id=player_db_id,
                        prize=r.get("prize"),
                        country=r.get("country"),
                        flag=r.get("flag"),
                        gpi_ranking=r.get("gpiRanking"),
                    )
                    session.add(result)

        session.commit()
        print(f"  赛事导入完成: {len(tournaments_data)} 条")

        # 3. 导入视频
        videos_data = data.get("INITIAL_VIDEOS", [])
        print(f"\n导入视频: {len(videos_data)} 条")

        for i, v in enumerate(videos_data):
            video = Video(
                title=v.get("title"),
                url=v.get("url"),
                thumbnail=v.get("thumbnail"),
                platform=v.get("platform"),
                duration=v.get("duration"),
                views=v.get("views"),
                published_at=v.get("publishedAt"),
                event=v.get("event"),
                players=v.get("players", []),
                subtitles=v.get("subtitles"),
                tags=v.get("tags", []),
            )
            session.add(video)

        session.commit()
        print(f"  视频导入完成: {len(videos_data)} 条")

        # 统计
        print(f"\n{'='*50}")
        print(f"迁移完成！")
        print(f"  选手: {session.query(Player).count()} 条")
        print(f"  比赛记录: {session.query(PlayerResult).count()} 条")
        print(f"  赛事: {session.query(Tournament).count()} 条")
        print(f"  子事件: {session.query(TournamentEvent).count()} 条")
        print(f"  视频片段: {session.query(Video).count()} 条")
        print(f"{'='*50}")

    except Exception as e:
        session.rollback()
        print(f"\n[ERROR] 迁移失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        session.close()


if __name__ == "__main__":
    # 设置路径
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(backend_dir)
    db_file = os.path.join(project_dir, "src", "data", "database.ts")

    if not os.path.exists(db_file):
        print(f"[ERROR] 找不到 database.ts: {db_file}")
        sys.exit(1)

    # 数据库连接
    from dotenv import load_dotenv
    env_file = os.path.join(backend_dir, ".env")
    if os.path.exists(env_file):
        load_dotenv(env_file)

    db_url = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:password@localhost:3306/poker_player_db?charset=utf8mb4"
    )

    print(f"数据库文件: {db_file}")
    print(f"数据库连接: {db_url.replace(os.getenv('DB_PASSWORD', ''), '***')}")
    print("开始解析 database.ts...")

    data = parse_database_ts(db_file)
    print(f"解析完成: PLAYERS={len(data.get('PLAYERS', []))}, "
          f"TOURNAMENTS={len(data.get('TOURNAMENTS', []))}, "
          f"INITIAL_VIDEOS={len(data.get('INITIAL_VIDEOS', []))}")

    # 保存解析结果为 JSON（调试用）
    json_path = "/tmp/poker_migration_data.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)
    print(f"解析数据已保存到: {json_path}")

    # 导入 MySQL
    print("\n开始导入 MySQL...")
    import_to_mysql(data, db_url)
