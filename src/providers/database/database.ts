import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScriptProvider } from '../script/script';
import { StepModel } from '../../models/step/step';

declare var SQL;

class MSQLiteObject {
  _objectInstance: any;

  constructor(_objectInstance: any) {
    this._objectInstance = _objectInstance;
  };

  executeSql(statement: string, params: any): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        var st = this._objectInstance.prepare(statement, params);
        var rows: Array<any> = [];
        while (st.step()) {
          var row = st.getAsObject();
          rows.push(row);
        }
        var payload = {
          rows: {
            item: function (i) {
              return rows[i];
            },
            length: rows.length
          },
          rowsAffected: this._objectInstance.getRowsModified() || 0,
          insertId: this._objectInstance.insertId || void 0
        };

        //save database after each sql query 

        var arr: ArrayBuffer = this._objectInstance.export();
        localStorage.setItem("database", String(arr));
        resolve(payload);
      } catch (e) {
        reject(e);
      }
    });
  };

}


export class SQLiteMock {
  public create(config: SQLiteDatabaseConfig): Promise<any> {

    if (document.URL.includes('https://') || document.URL.includes('http://')) {
      var db;
      var storeddb = localStorage.getItem("database");

      if (storeddb) {
        var arr = storeddb.split(',');
        db = new SQL.Database(arr);
      }
      else {
        db = new SQL.Database();
      }

      return new Promise((resolve, reject) => {
        resolve(new MSQLiteObject(db));
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(new SQLiteObject(new Object()));
      });
    }
  }
}

@Injectable()
export class DatabaseProvider {

  private database: any;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform: Platform, private sqlite: SQLite, private scripts: ScriptProvider) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: any) => {
          this.database = db;
          this.createTables().then(() => {
            this.dbReady.next(true);
          });
        })

    });
  }

  private promiseSerial(scripts: Array<any>) {
    let funcs: Array<any> = [];

    for (let cmd of scripts) {
      funcs.push(this.database.executeSql(cmd, {}));
    }

    return Promise.all(funcs);
  }

  private createTables() {
    return this.promiseSerial(this.scripts.createScripts());
  }

  private isReady() {
    return new Promise((resolve, reject) => {
      //if dbReady is true, resolve
      if (this.dbReady.getValue()) {
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else {
        this.dbReady.subscribe((ready) => {
          if (ready) {
            resolve();
          }
        });
      }
    })
  }

  isFirstTime() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT * FROM game`, [])
          .then((data) => {
            return data.rows.length === 0;
          })
      })
  }

  getGames() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT * from game`, [])
          .then((data) => {
            let games = [];
            for (let i = 0; i < data.rows.length; i++) {
              games.push(data.rows.item(i));
            }
            return games;
          })
      })
  }

  addGame(name: string) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`INSERT INTO game(name) VALUES ('${name}');`, {}).then((result) => {
          if (result.insertId) {
            return this.getGame(result.insertId);
          }
        })
      });
  }

  getGame(id: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT * FROM game WHERE id = ${id}`, [])
          .then((data) => {
            if (data.rows.length) {
              return data.rows.item(0);
            }
            return null;
          })
      })
  }

  getStep(id: number, idgame: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT gamestep.id, gamestep.idgame game, gamelevel.id idLevel, gamelevel.title levelTitle, gamestep.textstep textStep FROM gamestep, gamelevel WHERE gamelevel.id = gamestep.idlevel AND gamelevel.idgame = gamestep.idgame AND gamestep.id = ${id} AND gamestep.idgame = ${idgame}`, [])
          .then((data) => {
            if (data.rows.length) {
              return StepModel.fromJson(data.rows.item(0));
            }
            return null;
          })
      })
  }

  getTotalSteps(idgame: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT COUNT(1) total FROM gamestep WHERE idgame = ${idgame}`, [])
          .then((data) => {
            if (data.rows.length) {
              return data.rows.item(0).total;
            }
            return 0;
          })
      })
  }

  getActualStep(idgame: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT * FROM actual WHERE idgame = ${idgame}`, [])
          .then((data) => {
            if (data.rows.length) {
              return this.getStep(data.rows.item(0).idstep, idgame).then((step) => {
                return step;
              })
            } else {
              return this.database.executeSql(`INSERT INTO actual(idgame, idstep) VALUES (${idgame}, 1);`, {}).then((result) => {
                if (result.rowsAffected) {
                  return this.getStep(1, idgame).then((step) => {
                    return step;
                  })
                }
              })
            }
          })
      })
  }

  setActualStep(idstep: number, idgame: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`UPDATE actual SET idstep = ${idstep} WHERE idgame = ${idgame}`, [])
      })
  }

  deleteGame(id: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`DELETE FROM game WHERE id = ${id}`, [])
      })
  }

  dropTables() {
    return this.isReady()
      .then(() => {
        return this.promiseSerial(this.scripts.dropScripts());
      })
  }

  deleteGames() {
    return this.isReady()
      .then(() => {
        return this.promiseSerial(this.scripts.deleteScripts());
      })
  }

  insertGames() {
    return this.isReady()
      .then(() => {
        return this.promiseSerial(this.scripts.insertScripts());
      })
  }

}
