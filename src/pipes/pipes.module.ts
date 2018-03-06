import { NgModule } from '@angular/core';
import { ThumbnailPipe } from './thumbnail/thumbnail';
import { CoordinatesPipe } from './coordinates/coordinates';
@NgModule({
	declarations: [ThumbnailPipe,
    CoordinatesPipe],
	imports: [],
	exports: [ThumbnailPipe,
    CoordinatesPipe]
})
export class PipesModule {}
